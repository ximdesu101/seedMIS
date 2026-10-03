/**
 * Centralized Validation Utilities
 * Contains all validation rules and helpers for forms
 */

// ============================================
// REGEX PATTERNS
// ============================================

export const VALIDATION_PATTERNS = {
    // Email validation
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    
    // Password complexity (min 8, uppercase, lowercase, number, special char)
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
    
    // Phone number (10-11 digits, optional +63 prefix)
    phone: /^(\+63)?[0-9]{10,11}$/,
    
    // Philippine mobile number
    mobilePH: /^(09|\+639)\d{9}$/,
    
    // Numbers only
    numbersOnly: /^\d+$/,
    
    // Letters only (with spaces)
    lettersOnly: /^[a-zA-Z\s]+$/,
    
    // Alphanumeric
    alphanumeric: /^[a-zA-Z0-9]+$/,
    
    // No special characters (letters, numbers, spaces, hyphens)
    noSpecialChars: /^[a-zA-Z0-9\s-]+$/,
    
    // Positive numbers (decimal allowed)
    positiveNumber: /^\d+(\.\d{1,2})?$/,
    
    // Integer only
    integer: /^[1-9]\d*$/,
    
    // Staff ID format (STF-0001)
    staffId: /^STF-\d{4}$/,
    
    // Client ID format (CLT-0001)
    clientId: /^CLT-\d{4}$/,
    
    // Batch ID format (BAT-0001)
    batchId: /^BAT-\d{4}$/,
};

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validate email format
 */
export const validateEmail = (email) => {
    if (!email) return { valid: false, message: "Email is required" };
    if (!VALIDATION_PATTERNS.email.test(email)) {
        return { valid: false, message: "Invalid email format" };
    }
    return { valid: true, message: "" };
};

/**
 * Validate password complexity
 */
export const validatePassword = (password) => {
    if (!password) return { valid: false, message: "Password is required" };
    
    if (password.length < 8) {
        return { valid: false, message: "Password must be at least 8 characters" };
    }
    
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: "Password must contain lowercase letter" };
    }
    
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: "Password must contain uppercase letter" };
    }
    
    if (!/\d/.test(password)) {
        return { valid: false, message: "Password must contain a number" };
    }
    
    if (!/[@$!%*?&#]/.test(password)) {
        return { valid: false, message: "Password must contain special character (@$!%*?&#)" };
    }
    
    return { valid: true, message: "" };
};

/**
 * Validate phone number
 */
export const validatePhone = (phone) => {
    if (!phone) return { valid: false, message: "Phone number is required" };
    
    // Remove spaces and hyphens
    const cleanPhone = phone.replace(/[\s-]/g, '');
    
    if (!VALIDATION_PATTERNS.phone.test(cleanPhone)) {
        return { valid: false, message: "Invalid phone number format" };
    }
    
    return { valid: true, message: "" };
};

/**
 * Validate required field
 */
export const validateRequired = (value, fieldName = "This field") => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
        return { valid: false, message: `${fieldName} is required` };
    }
    return { valid: true, message: "" };
};

/**
 * Validate minimum length
 */
export const validateMinLength = (value, min, fieldName = "This field") => {
    if (value && value.length < min) {
        return { valid: false, message: `${fieldName} must be at least ${min} characters` };
    }
    return { valid: true, message: "" };
};

/**
 * Validate maximum length
 */
export const validateMaxLength = (value, max, fieldName = "This field") => {
    if (value && value.length > max) {
        return { valid: false, message: `${fieldName} must not exceed ${max} characters` };
    }
    return { valid: true, message: "" };
};

/**
 * Validate positive number
 */
export const validatePositiveNumber = (value, fieldName = "This field") => {
    if (!value) return { valid: false, message: `${fieldName} is required` };
    
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
        return { valid: false, message: `${fieldName} must be a positive number` };
    }
    
    return { valid: true, message: "" };
};

/**
 * Validate integer
 */
export const validateInteger = (value, fieldName = "This field") => {
    if (!value) return { valid: false, message: `${fieldName} is required` };
    
    if (!VALIDATION_PATTERNS.integer.test(value.toString())) {
        return { valid: false, message: `${fieldName} must be a positive integer` };
    }
    
    return { valid: true, message: "" };
};

/**
 * Validate minimum value
 */
export const validateMinValue = (value, min, fieldName = "This field") => {
    const num = parseFloat(value);
    if (isNaN(num) || num < min) {
        return { valid: false, message: `${fieldName} must be at least ${min}` };
    }
    return { valid: true, message: "" };
};

/**
 * Validate maximum value
 */
export const validateMaxValue = (value, max, fieldName = "This field") => {
    const num = parseFloat(value);
    if (isNaN(num) || num > max) {
        return { valid: false, message: `${fieldName} must not exceed ${max}` };
    }
    return { valid: true, message: "" };
};

/**
 * Validate range
 */
export const validateRange = (value, min, max, fieldName = "This field") => {
    const num = parseFloat(value);
    if (isNaN(num) || num < min || num > max) {
        return { valid: false, message: `${fieldName} must be between ${min} and ${max}` };
    }
    return { valid: true, message: "" };
};

/**
 * Validate letters only
 */
export const validateLettersOnly = (value, fieldName = "This field") => {
    if (value && !VALIDATION_PATTERNS.lettersOnly.test(value)) {
        return { valid: false, message: `${fieldName} must contain only letters` };
    }
    return { valid: true, message: "" };
};

/**
 * Validate no special characters
 */
export const validateNoSpecialChars = (value, fieldName = "This field") => {
    if (value && !VALIDATION_PATTERNS.noSpecialChars.test(value)) {
        return { valid: false, message: `${fieldName} cannot contain special characters` };
    }
    return { valid: true, message: "" };
};

/**
 * Validate date is not in the past
 */
export const validateNotPastDate = (date, fieldName = "Date") => {
    if (!date) return { valid: false, message: `${fieldName} is required` };
    
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        return { valid: false, message: `${fieldName} cannot be in the past` };
    }
    
    return { valid: true, message: "" };
};

/**
 * Validate date is weekday (no weekends)
 */
export const validateWeekday = (date, fieldName = "Date") => {
    if (!date) return { valid: false, message: `${fieldName} is required` };
    
    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();
    
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return { valid: false, message: `${fieldName} cannot be on weekends` };
    }
    
    return { valid: true, message: "" };
};

/**
 * Validate password confirmation match
 */
export const validatePasswordMatch = (password, confirmation) => {
    if (password !== confirmation) {
        return { valid: false, message: "Passwords do not match" };
    }
    return { valid: true, message: "" };
};

// ============================================
// FORM-SPECIFIC VALIDATORS
// ============================================

/**
 * Validate Client Form
 */
export const validateClientForm = (formData) => {
    const errors = {};
    
    // Client ID
    const clientIdValidation = validateRequired(formData.client_id, "Client ID");
    if (!clientIdValidation.valid) errors.client_id = clientIdValidation.message;
    
    // Organization
    const orgValidation = validateRequired(formData.organization, "Organization");
    if (!orgValidation.valid) errors.organization = orgValidation.message;
    
    // First Name
    const firstNameValidation = validateRequired(formData.first_name, "First Name");
    if (!firstNameValidation.valid) {
        errors.first_name = firstNameValidation.message;
    } else {
        const lettersValidation = validateLettersOnly(formData.first_name, "First Name");
        if (!lettersValidation.valid) errors.first_name = lettersValidation.message;
    }
    
    // Last Name
    const lastNameValidation = validateRequired(formData.last_name, "Last Name");
    if (!lastNameValidation.valid) {
        errors.last_name = lastNameValidation.message;
    } else {
        const lettersValidation = validateLettersOnly(formData.last_name, "Last Name");
        if (!lettersValidation.valid) errors.last_name = lettersValidation.message;
    }
    
    // Email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) errors.email = emailValidation.message;
    
    // Phone
    const phoneValidation = validatePhone(formData.contact_number);
    if (!phoneValidation.valid) errors.contact_number = phoneValidation.message;
    
    // Password (if creating new)
    if (formData.password) {
        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.valid) errors.password = passwordValidation.message;
        
        const matchValidation = validatePasswordMatch(formData.password, formData.password_confirmation);
        if (!matchValidation.valid) errors.password_confirmation = matchValidation.message;
    }
    
    // Address fields
    const barangayValidation = validateRequired(formData.barangay, "Barangay");
    if (!barangayValidation.valid) errors.barangay = barangayValidation.message;
    
    const municipalityValidation = validateRequired(formData.municipality, "Municipality");
    if (!municipalityValidation.valid) errors.municipality = municipalityValidation.message;
    
    const provinceValidation = validateRequired(formData.province, "Province");
    if (!provinceValidation.valid) errors.province = provinceValidation.message;
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Validate Staff Form
 */
export const validateStaffForm = (formData) => {
    const errors = {};
    
    // Staff ID
    const staffIdValidation = validateRequired(formData.staff_id, "Staff ID");
    if (!staffIdValidation.valid) errors.staff_id = staffIdValidation.message;
    
    // First Name
    const firstNameValidation = validateRequired(formData.first_name, "First Name");
    if (!firstNameValidation.valid) {
        errors.first_name = firstNameValidation.message;
    } else {
        const lettersValidation = validateLettersOnly(formData.first_name, "First Name");
        if (!lettersValidation.valid) errors.first_name = lettersValidation.message;
    }
    
    // Last Name
    const lastNameValidation = validateRequired(formData.last_name, "Last Name");
    if (!lastNameValidation.valid) {
        errors.last_name = lastNameValidation.message;
    } else {
        const lettersValidation = validateLettersOnly(formData.last_name, "Last Name");
        if (!lettersValidation.valid) errors.last_name = lettersValidation.message;
    }
    
    // Email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) errors.email = emailValidation.message;
    
    // Position
    const positionValidation = validateRequired(formData.position, "Position");
    if (!positionValidation.valid) errors.position = positionValidation.message;
    
    // Phone
    const phoneValidation = validatePhone(formData.contact_number);
    if (!phoneValidation.valid) errors.contact_number = phoneValidation.message;
    
    // Password (if creating new)
    if (formData.password) {
        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.valid) errors.password = passwordValidation.message;
        
        const matchValidation = validatePasswordMatch(formData.password, formData.password_confirmation);
        if (!matchValidation.valid) errors.password_confirmation = matchValidation.message;
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Validate Production Form
 */
export const validateProductionForm = (formData) => {
    const errors = {};
    
    // Batch ID
    const batchIdValidation = validateRequired(formData.batch_id, "Batch ID");
    if (!batchIdValidation.valid) errors.batch_id = batchIdValidation.message;
    
    // Seedling Type
    const seedlingTypeValidation = validateRequired(formData.seedling_type, "Seedling Type");
    if (!seedlingTypeValidation.valid) errors.seedling_type = seedlingTypeValidation.message;
    
    // Classification
    const classificationValidation = validateRequired(formData.classification, "Classification");
    if (!classificationValidation.valid) errors.classification = classificationValidation.message;
    
    // Quantity Sown
    const quantitySownValidation = validateInteger(formData.quantity_sown, "Quantity Sown");
    if (!quantitySownValidation.valid) errors.quantity_sown = quantitySownValidation.message;
    
    // Current Quantity
    const currentQuantityValidation = validateInteger(formData.current_quantity, "Current Quantity");
    if (!currentQuantityValidation.valid) errors.current_quantity = currentQuantityValidation.message;
    
    // Stage
    const stageValidation = validateRequired(formData.stage, "Stage");
    if (!stageValidation.valid) errors.stage = stageValidation.message;
    
    // Location
    const locationValidation = validateRequired(formData.location, "Location");
    if (!locationValidation.valid) errors.location = locationValidation.message;
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Validate Request Form
 */
export const validateRequestForm = (formData) => {
    const errors = {};
    
    // Client
    const clientValidation = validateRequired(formData.client_id, "Client");
    if (!clientValidation.valid) errors.client_id = clientValidation.message;
    
    // Seedling Type
    const seedlingValidation = validateRequired(formData.seedling_type, "Seedling Type");
    if (!seedlingValidation.valid) errors.seedling_type = seedlingValidation.message;
    
    // Quantity
    const quantityValidation = validateInteger(formData.quantity, "Quantity");
    if (!quantityValidation.valid) errors.quantity = quantityValidation.message;
    
    // Purpose
    const purposeValidation = validateRequired(formData.purpose, "Purpose");
    if (!purposeValidation.valid) {
        errors.purpose = purposeValidation.message;
    } else {
        const minLengthValidation = validateMinLength(formData.purpose, 10, "Purpose");
        if (!minLengthValidation.valid) errors.purpose = minLengthValidation.message;
    }
    
    // Requested Date
    const dateValidation = validateNotPastDate(formData.requested_date, "Requested Date");
    if (!dateValidation.valid) {
        errors.requested_date = dateValidation.message;
    } else {
        const weekdayValidation = validateWeekday(formData.requested_date, "Requested Date");
        if (!weekdayValidation.valid) errors.requested_date = weekdayValidation.message;
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Validate Target Form
 */
export const validateTargetForm = (formData) => {
    const errors = {};
    
    // Seedling Type
    const seedlingValidation = validateRequired(formData.seedling_type, "Seedling Type");
    if (!seedlingValidation.valid) errors.seedling_type = seedlingValidation.message;
    
    // Target Quantity
    const targetValidation = validateInteger(formData.target_quantity, "Target Quantity");
    if (!targetValidation.valid) errors.target_quantity = targetValidation.message;
    
    // Year
    const yearValidation = validateRequired(formData.year, "Year");
    if (!yearValidation.valid) errors.year = yearValidation.message;
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// ============================================
// SANITIZATION HELPERS
// ============================================

/**
 * Sanitize string input (trim whitespace, remove extra spaces)
 */
export const sanitizeString = (value) => {
    if (!value) return '';
    return value.trim().replace(/\s+/g, ' ');
};

/**
 * Sanitize number input (remove non-numeric characters)
 */
export const sanitizeNumber = (value) => {
    if (!value) return '';
    return value.toString().replace(/[^0-9]/g, '');
};

/**
 * Sanitize decimal input (allow numbers and one decimal point)
 */
export const sanitizeDecimal = (value) => {
    if (!value) return '';
    return value.toString().replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
};

/**
 * Sanitize phone number (remove spaces and special characters except +)
 */
export const sanitizePhone = (value) => {
    if (!value) return '';
    return value.replace(/[^0-9+]/g, '');
};

export default {
    VALIDATION_PATTERNS,
    validateEmail,
    validatePassword,
    validatePhone,
    validateRequired,
    validateMinLength,
    validateMaxLength,
    validatePositiveNumber,
    validateInteger,
    validateMinValue,
    validateMaxValue,
    validateRange,
    validateLettersOnly,
    validateNoSpecialChars,
    validateNotPastDate,
    validateWeekday,
    validatePasswordMatch,
    validateClientForm,
    validateStaffForm,
    validateProductionForm,
    validateRequestForm,
    validateTargetForm,
    sanitizeString,
    sanitizeNumber,
    sanitizeDecimal,
    sanitizePhone,
};
