import vine from '@vinejs/vine'
import Roles from '#enums/roles'

export const userValidator = vine.compile(
  vine.object({
    first_name: vine.string().trim().minLength(2).maxLength(50),
    last_name: vine.string().trim().maxLength(50).optional(),
    email: vine.string().maxLength(254).email(),
    password: vine.string().minLength(8),
    role_id: vine
      .number()
      .in([Roles.ADMIN, Roles.RECEPTION, Roles.RADIOGRAPHER, Roles.RADIOLOGIST, Roles.MANAGER]),
  })
)

export const userUpdateValidator = vine.compile(
  vine.object({
    first_name: vine.string().trim().minLength(2),

    last_name: vine.string().trim().optional(),

    password: vine.string().minLength(8).optional(),

    role_id: vine
      .number()
      .in([Roles.ADMIN, Roles.RECEPTION, Roles.RADIOGRAPHER, Roles.RADIOLOGIST, Roles.MANAGER]),
  })
)
