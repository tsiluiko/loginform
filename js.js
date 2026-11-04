const validationPage = new ValidationPage();

const form = document.getElementById("registrationForm");
const submitBtn = document.getElementById("submitBtn");
const showPassword = document.getElementById("showPassword");
const passwordRules = document.querySelectorAll("#passwordRules li");
const successMessage = document.getElementById("successMessage");

const fields = {
    firstName: document.getElementById("firstName"),
    lastName: document.getElementById("lastName"),
    email: document.getElementById("email"),
    password: document.getElementById("password")
};

// додає зелену або червону індикацію та текст помилки
function validOrInvalid(input, isValid, errorElement, message) {
    input.classList.toggle("valid", isValid);
    input.classList.toggle("invalid", !isValid);
    errorElement.textContent = message;
}

function getFormData() {
    return {
        firstName: fields.firstName.value.trim(),
        lastName: fields.lastName.value.trim(),
        email: fields.email.value.trim(),
        password: fields.password.value
    };
}

// перевіряє одне поле і показує результат
function validateField(name) {
    const input = fields[name];
    const value = input.value;

    if (name === "firstName" || name === "lastName") {
        validationPage.validateName(value, name);
    } else if (name === "email") {
        validationPage.validateEmail(value);
    } else if (name === "password") {
        validationPage.validatePassword(value);
        updatePasswordRules(value);
    }

    const errors = validationPage.errors[name];
    const errorElement = document.getElementById(name + "Error");
    if (errors) {
        // показуємо всі невиконані умови, кожну з нового рядка
        validOrInvalid(input, false, errorElement, errors.join("\n"));
    } else {
        validOrInvalid(input, true, errorElement, "");
    }
}

// підсвічує виконані (зелені) та невиконані умови пароля
function updatePasswordRules(value) {
    const result = validationPage.checkPasswordRules(value);
    passwordRules.forEach(li => {
        li.classList.toggle("ok", result[li.dataset.rule]);
    });
}

// кнопка активна лише тоді, коли всі поля валідні
function updateSubmitButton() {
    validationPage.validateForm(getFormData());
    submitBtn.disabled = !validationPage.isValid();
}

// жива валідація: перевірка після кожної зміни (подія input)
for (const name in fields) {
    fields[name].addEventListener("input", () => {
        successMessage.hidden = true;
        validateField(name);
        updateSubmitButton();
    });
}

// чекбокс "Показати пароль"
showPassword.addEventListener("change", () => {
    fields.password.type = showPassword.checked ? "text" : "password";
});

// обробка форми
form.addEventListener("submit", (event) => {
    event.preventDefault();   // сторінка не перезавантажується

    const data = getFormData();
    validationPage.validateForm(data);

    // повторна перевірка всіх полів (на випадок, якщо кнопку активували вручну)
    if (!validationPage.isValid()) {
        for (const name in fields) validateField(name);
        submitBtn.disabled = true;
        console.warn("Форму не відправлено, є помилки:", validationPage.errors);
        return;
    }

    console.log("Форму успішно відправлено:", data);
    alert(
        "Реєстрація успішна!\n\n" +
        "Ім'я: " + data.firstName + "\n" +
        "Прізвище: " + data.lastName + "\n" +
        "E-mail: " + data.email + "\n" +
        "Пароль: " + "*".repeat(data.password.length)
    );

    successMessage.textContent = `Користувача ${data.firstName} ${data.lastName} зареєстровано (дані виведено в консоль)`;
    successMessage.hidden = false;
});

// Об'єкт з усіма правилами валідації та текстами помилок
const UA_UPPER = "АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ";
const UA_LOWER = "абвгґдеєжзиіїйклмнопрстуфхцчшщьюя";

const validationRules = {
    name: {
        // лише англійські або українські літери (без цифр, пробілів і символів)
        pattern: `^[A-Za-z${UA_UPPER}${UA_LOWER}]+$`,
        // перша літера - велика (англійська або українська)
        firstCapital: `^[A-Z${UA_UPPER}]`,
        errorMessages: {
            required: "Поле обов'язкове для заповнення",
            pattern: "Допускаються лише українські чи англійські літери",
            firstCapital: "Має починатися з великої літери"
        }
    },
    email: {
        pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\\.[a-zA-Z]{2,}$",
        errorMessages: {
            required: "Поле обов'язкове для заповнення",
            pattern: "Невірний формат e-mail"
        }
    },
    password: {
        minLength: 8,
        uppercase: "[A-Z]",
        lowercase: "[a-z]",
        number: "\\d",
        specialCharacter: "[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?`~]",
        errorMessages: {
            required: "Поле обов'язкове для заповнення",
            minLength: "Пароль має містити щонайменше 8 символів",
            uppercase: "Пароль має містити хоча б одну велику літеру",
            lowercase: "Пароль має містити хоча б одну маленьку літеру",
            number: "Пароль має містити хоча б одну цифру",
            specialCharacter: "Пароль має містити хоча б один спеціальний символ"
        }
    }
};

// Клас валідації - використовує об'єкт validationRules з файлу validation.js
class ValidationPage {
    constructor() {
        this.errors = {};   // { назваПоля: [список помилок] }
    }

    static validatePattern(value, pattern) {
        return new RegExp(pattern).test(value);
    }

    static validateMinLength(value, minLength) {
        return value.length >= minLength;
    }

    // запам'ятовує помилки поля; якщо помилок немає - видаляє ключ
    setErrors(field, list) {
        if (list.length > 0) {
            this.errors[field] = list;
        } else {
            delete this.errors[field];
        }
    }

    validateName(value, field) {
        const rule = validationRules.name;
        const list = [];
        value = value.trim();

        if (value === "") {
            list.push(rule.errorMessages.required);
        } else {
            if (!ValidationPage.validatePattern(value, rule.pattern)) {
                list.push(rule.errorMessages.pattern);
            }
            if (!ValidationPage.validatePattern(value, rule.firstCapital)) {
                list.push(rule.errorMessages.firstCapital);
            }
        }
        this.setErrors(field, list);
    }

    validateEmail(value) {
        const rule = validationRules.email;
        const list = [];
        value = value.trim();

        if (value === "") {
            list.push(rule.errorMessages.required);
        } else if (!ValidationPage.validatePattern(value, rule.pattern)) {
            list.push(rule.errorMessages.pattern);
        }
        this.setErrors("email", list);
    }

    // повертає об'єкт { правило: true/false } для підсвічування списку умов
    checkPasswordRules(value) {
        const rule = validationRules.password;
        return {
            minLength: ValidationPage.validateMinLength(value, rule.minLength),
            uppercase: ValidationPage.validatePattern(value, rule.uppercase),
            lowercase: ValidationPage.validatePattern(value, rule.lowercase),
            number: ValidationPage.validatePattern(value, rule.number),
            specialCharacter: ValidationPage.validatePattern(value, rule.specialCharacter)
        };
    }

    validatePassword(value) {
        const messages = validationRules.password.errorMessages;
        const list = [];

        if (value === "") {
            list.push(messages.required);
        } else {
            const result = this.checkPasswordRules(value);
            for (const key in result) {
                if (!result[key]) list.push(messages[key]);
            }
        }
        this.setErrors("password", list);
    }

    validateForm(data) {
        this.errors = {};
        this.validateName(data.firstName, "firstName");
        this.validateName(data.lastName, "lastName");
        this.validateEmail(data.email);
        this.validatePassword(data.password);
        return this.errors;
    }

    isValid() {
        return Object.keys(this.errors).length === 0;
    }
}
