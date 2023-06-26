import {body} from "express-validator"

export const loginValidator = [
    body('email', 'email.required')
        .isEmail()
        .withMessage('email.invalid')
        .isLength({min: 7, max: 40})
        .withMessage('Допустимое кол-во символов в почте от 7 до 40.'),
    body('password', 'Введите пароль')
        .isString()
        .isLength({
            min: 6,
        })
        .withMessage('Минимальная длина пароля 6 символов')
]

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
    body('avatarUrl', "avatarUrl.invalid")
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

export const postValidator = [
    body('title', "post.title.required")
        .isString()
        .isLength({min: 3, max: 200})
        .withMessage('min: 3, max: 200'),
    body('text', "post.text.required")
        .isString()
        .isLength({min: 10, max: 400})
        .withMessage('min: 10, max: 400'),
    body('imageUrl', "post.imageUrl.invalid")
        .optional()
        .isString(),
    body('tags', "post.tags.isArray")
        .optional()
        .isString(),
]