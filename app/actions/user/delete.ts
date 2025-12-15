import User from '#models/user'

export default class DeleteUser {
  async handle(userId: number) {
    const user = await User.findOrFail(userId)
    await user.delete()
    return true
  }
}
