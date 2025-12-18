import vine from '@vinejs/vine'
import Roles from '#enums/roles'

export const userValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2).maxLength(50),
    lastName: vine.string().trim().maxLength(50).optional(),
    email: vine.string().maxLength(254).email(),
    password: vine.string().minLength(8),
    roleId: vine
      .number()
      .in([Roles.ADMIN, Roles.RECEPTION, Roles.RADIOGRAPHER, Roles.RADIOLOGIST, Roles.MANAGER]),
  })
)

export const userUpdateValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2),
    lastName: vine.string().trim().optional(),
    password: vine.string().minLength(8).optional(),
    roleId: vine
      .number()
      .in([Roles.ADMIN, Roles.RECEPTION, Roles.RADIOGRAPHER, Roles.RADIOLOGIST, Roles.MANAGER]),
  })
)
