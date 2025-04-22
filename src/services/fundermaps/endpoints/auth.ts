import { get, post } from '../client'

const login = (email: string, password: string): Promise<any> => {
  return post({
    endpoint: '/auth/signin',
    body: {
      email,
      password
    },
    requireAuth: false
  })
}

const refresh = () => {
  return get({
    endpoint: 'auth/token-refresh',
    requireAuth: true
  })
}

const requestPasswordReset = (email: string): Promise<any> => {
  return post({
    endpoint: '/auth/reset-password',
    body: {
      email
    },
    requireAuth: false
  })
}

const resetPassword = (
  email: string,
  token: string,
  password: string
): Promise<any> => {
  return post({
    endpoint: '/auth/reset-new-password',
    body: {
      email,
      resetKey: token,
      newPassword: password
    },
    requireAuth: false
  })
}

const changePassword = (
  oldPassword: string,
  newPassword: string
): Promise<any> => {
  return post({
    endpoint: '/auth/change-password',
    body: {
      oldPassword: oldPassword,
      newPassword: newPassword
    },
    requireAuth: true
  })
}

export default {
  login,
  refresh,
  requestPasswordReset,
  resetPassword,
  changePassword
}
