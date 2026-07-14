<?php
/**
 * /api/reports/finance.php
 * GET - finance summary from backend finance tables
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$user = requireRole(['Admin', 'Accountant']);
$db = getDB();

function financeScalar(PDO $db, string $sql, array $params = []): float {
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    return (float)($stmt->fetchColumn() ?: 0);
}

function financeRows(PDO $db, string $sql, array $params = []): array {
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll();
}

$term = $_GET['term'] ?? null;
$year = $_GET['academic_year'] ?? null;

if (!$term || !$year) {
    $settings = [];
    foreach ($db->query("SELECT setting_key, setting_value FROM settings WHERE setting_key IN ('current_term','academic_year')") as $row) {
        $settings[$row['setting_key']] = $row['setting_value'];
    }
    $term = $term ?: ($settings['current_term'] ?? '1st Term');
    $year = $year ?: ($settings['academic_year'] ?? '2024/2025');
}

$feeParams = [$term, $year];
$totalFeesDue = financeScalar($db, "SELECT COALESCE(SUM(amount_due), 0) FROM fees WHERE term = ? AND academic_year = ?", $feeParams);
$totalFeesCollected = financeScalar($db, "SELECT COALESCE(SUM(amount_paid), 0) FROM fees WHERE term = ? AND academic_year = ?", $feeParams);
$totalFeesOutstanding = max(0, $totalFeesDue - $totalFeesCollected);

$paymentTotal = financeScalar($db, "SELECT COALESCE(SUM(amount), 0) FROM payments WHERE term = ? AND academic_year = ?", $feeParams);
$salaryTotal = financeScalar($db, "SELECT COALESCE(SUM(net_salary), 0) FROM salary WHERE term = ? AND academic_year = ?", $feeParams);
$expenseTotal = financeScalar($db, "SELECT COALESCE(SUM(amount), 0) FROM expenses");
$nonSalaryExpenses = max(0, $expenseTotal);
$totalExpenditure = $salaryTotal + $nonSalaryExpenses;
$totalIncome = $paymentTotal;
$netSurplus = $totalIncome - $totalExpenditure;

$incomeBreakdown = [
    ['source' => 'School Fees', 'amount' => $paymentTotal],
];

$expenseBreakdown = [];
if ($salaryTotal > 0) {
    $expenseBreakdown[] = ['category' => 'Staff Salaries', 'amount' => $salaryTotal];
}
foreach (financeRows($db, "SELECT COALESCE(category, 'Other Expenses') AS category, COALESCE(SUM(amount), 0) AS amount FROM expenses GROUP BY COALESCE(category, 'Other Expenses') ORDER BY amount DESC") as $row) {
    $expenseBreakdown[] = ['category' => $row['category'], 'amount' => (float)$row['amount']];
}

$recentExpenses = financeRows($db, "SELECT id, category, description, amount, expense_date, recorded_by FROM expenses ORDER BY expense_date DESC, id DESC LIMIT 50");

jsonResponse([
    'success' => true,
    'data' => [
        'term' => $term,
        'academic_year' => $year,
        'total_fees_due' => $totalFeesDue,
        'total_fees_collected' => $totalFeesCollected,
        'total_fees_outstanding' => $totalFeesOutstanding,
        'total_income' => $totalIncome,
        'total_expenditure' => $totalExpenditure,
        'net_surplus' => $netSurplus,
        'salary_total' => $salaryTotal,
        'expense_total' => $expenseTotal,
        'income_breakdown' => $incomeBreakdown,
        'expense_breakdown' => $expenseBreakdown,
        'recent_expenses' => $recentExpenses,
    ],
]);
