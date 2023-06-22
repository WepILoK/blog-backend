import {body} from "express-validator"

export const registerValidator = [
    body('email', 'email.required')
        .isEmail()
        .withMessage('email.invalid')
        .isLength({min: 7, max: 40})
        .withMessage('Допустимое кол-во символов в почте от 7 до 40.'),
    body('fullName', 'Введите логин')
        .isString()
        .isLength({min: 4, max: 40})
        .withMessage('Допустимое кол-во символов в логине от 4 до 40.'),
    body('avatarUrl')
        .optional()
        .isURL(),
    body('password', 'Введите пароль')
        .isString()
        .isLength({
            min: 6,
        })
        .withMessage('Минимальная длина пароля 6 символов')
        .custom((value, {req}) => {
            if (!req.body.password2) {
                throw new Error('Повторите пароль');
            }else if (value !== req.body.password2) {
                throw new Error('Пароли не совпадают');
            } else {
                return value;
            }
        }),
]