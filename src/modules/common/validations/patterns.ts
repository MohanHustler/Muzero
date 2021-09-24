/* eslint-disable */
export const OTP_PATTERN = /^\d{6}$/; // 6 Digit Number
export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/; // @see https://dzone.com/articles/use-regex-test-password#:~:text=The%20string%20must%20contain%20at%20least%201%20lowercase%20alphabetical%20character.&text=The%20string%20must%20contain%20at%20least%201%20uppercase%20alphabetical%20character.&text=The%20string%20must%20contain%20at%20least%201%20numeric%20character.&text=The%20string%20must%20contain%20at%20least%20one%20special%20character%2C%20but,RegEx%20characters%20to%20avoid%20conflict.

// Org name won't accept numberic values in this regx pattern
export const ORG_NAME_PATTERN = /^(?!\s)(?!.*\s$)(?=.*[a-zA-Z])[a-zA-Z '~?!]{2,}$/; //https://stackoverflow.com/questions/30726203/javascript-regular-expression-for-business-name-with-some-validation/30727058
export const PHONE_PATTERN = /^[6-9]\d{9}$/; // @see https://stackoverflow.com/questions/22378736/regex-for-mobile-number-validation/22378975
export const EMAIL_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const PAN_PATTERN = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/; // https://stackoverflow.com/questions/37251151/pancard-structure-validation-in-javascript-and-php-also
export const NUMBER_PATTERN = /^-?\d+(,\d+)*(\.\d+(e\d+)?)?$/;
export const PIN_PATTERN = /^[1-9][0-9]{5}$/; //https://stackoverflow.com/questions/33865525/indian-pincode-validation-regex-only-six-digits-shouldnt-start-with-0/33865555
export const AADHAAR_PATTERN = /^[0-9]{12}$/;
export const IFSC_PATTERN = /^[A-Z]{4}0[A-Z0-9]{6}$/; //https://www.geeksforgeeks.org/how-to-validate-ifsc-code-using-regular-expression/
export const GST_PATTERN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/; //https://www.geeksforgeeks.org/how-to-validate-gst-goods-and-services-tax-number-using-regular-expression/
export const ORG_CODE_PATTERN = /^[a-zA-Z]{5,50}/; //only alphabets and min 5 max 50 characters
export const ACCOUNT_NO_PATTERN = /^\d{9,18}$/; // https://stackoverflow.com/questions/43761073/regexp-for-indian-bank-account-number
export const NAME_PATTERN = /^s*([A-Za-z]{1,}([.,] |[-']| )?)+[A-Za-z]+.?s*$/; // https://stackoverflow.com/questions/3073850/javascript-regex-test-peoples-name/47722835
