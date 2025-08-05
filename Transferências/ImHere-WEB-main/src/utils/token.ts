"use server"
import { cookies } from 'next/headers';
const TOKEN_NAME = "im-here-web"

export async function setToken(value: string) {

  (await cookies()).set({
    name: TOKEN_NAME,
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 603740, // expira 1 minuto antes do backend("expiresIn": 604800)
    path: '/',
  })
}

export async function getToken() {
  return (await cookies()).get(TOKEN_NAME)?.value
}

export async function deleteToken() {
  (await cookies()).delete(TOKEN_NAME)
}
