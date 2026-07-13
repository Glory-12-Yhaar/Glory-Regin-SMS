/**
 * Glory Reign School Management System — Settings Manager
 * Integrates client-side SETTINGS_DATA with persistent database API
 */

// Override saveSettingsToStorage to save to database
if (typeof saveSettingsToStorage === 'function') {
    const originalSave = saveSettingsToStorage;
    saveSettingsToStorage = async function() {
        originalSave(); // Keep local storage sync
        
        // Flatten SETTINGS_DATA for the backend settings table
        const flatData = {};
        for (let cat in SETTINGS_DATA) {
            if (typeof SETTINGS_DATA[cat] === 'object' && SETTINGS_DATA[cat] !== null) {
                for (let sk in SETTINGS_DATA[cat]) {
                    const flatKey = `${cat.toLowerCase()}_${sk.toLowerCase()}`;
                    flatData[flatKey] = String(SETTINGS_DATA[cat][sk]);
                }
            }
        }
        
        try {
            const res = await API.settings.update(flatData);
            if (res && res.success) {
                console.log('Settings successfully persisted to database.');
            } else {
                console.warn('Failed to persist settings to database:', res?.message);
            }
        } catch (e) {
            console.error('Error saving settings to database:', e);
        }
    };
}

// Override loadSettingsFromStorage to load from database
if (typeof loadSettingsFromStorage === 'function') {
    const originalLoad = loadSettingsFromStorage;
    loadSettingsFromStorage = async function() {
        originalLoad(); // Load local storage defaults first
        
        try {
            const res = await API.settings.get();
            if (res && res.success && res.data) {
                const data = res.data;
                // Map flat keys back to nested SETTINGS_DATA
                for (let key in data) {
                    const parts = key.split('_');
                    if (parts.length === 2) {
                        const category = parts[0];
                        const subkey = parts[1];
                        
                        for (let cat in SETTINGS_DATA) {
                            if (cat.toLowerCase() === category) {
                                for (let sk in SETTINGS_DATA[cat]) {
                                    if (sk.toLowerCase() === subkey) {
                                        let val = data[key];
                                        if (val === 'true') val = true;
                                        else if (val === 'false') val = false;
                                        SETTINGS_DATA[cat][sk] = val;
                                    }
                                }
                            }
                        }
                    }
                }
                console.log('Settings successfully loaded from database.');
                
                // If there is an active settings rendering, update inputs
                updateSettingsFormInputs();
            }
        } catch (e) {
            console.error('Error loading settings from database:', e);
        }
    };
}

// Helper to refresh settings form input values if settings tab is currently active
function updateSettingsFormInputs() {
    if (typeof SETTINGS_DATA === 'undefined') return;
    
    const elements = {
        'school-name': SETTINGS_DATA.schoolInfo?.schoolName,
        'school-motto': SETTINGS_DATA.schoolInfo?.schoolMotto,
        'school-region': SETTINGS_DATA.schoolInfo?.region,
        'school-district': SETTINGS_DATA.schoolInfo?.district,
        'school-phone': SETTINGS_DATA.schoolInfo?.phone,
        'school-email': SETTINGS_DATA.schoolInfo?.email,
        'school-address': SETTINGS_DATA.schoolInfo?.address,
        'school-website': SETTINGS_DATA.schoolInfo?.website,
        
        'academic-year': SETTINGS_DATA.academic?.academicYear,
        'current-term': SETTINGS_DATA.academic?.currentTerm,
        'term-start-date': SETTINGS_DATA.academic?.termStartDate,
        'term-end-date': SETTINGS_DATA.academic?.termEndDate,
        
        'maintenance-mode': SETTINGS_DATA.system?.maintenanceMode !== undefined ? String(SETTINGS_DATA.system.maintenanceMode) : undefined,
        'backup-frequency': SETTINGS_DATA.system?.backupFrequency,
    };
    
    for (let id in elements) {
        const el = document.getElementById(id);
        if (el && elements[id] !== undefined) {
            el.value = elements[id];
        }
    }
}

// Automatically load database settings after initialization
document.addEventListener('DOMContentLoaded', () => {
    if (typeof loadSettingsFromStorage === 'function') {
        loadSettingsFromStorage();
    }
});
