// noinspection MagicNumberJS

import axios from 'axios'
export class ApiError extends Error {
  status : number
  webhook : boolean
  constructor(message : string = 'Something went wrong', status : number = 500, webhook : boolean = true) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.webhook = webhook
  }
}
export const axiosDiscourse = axios.create({
  headers: {
    'api-key': process.env['DISCOURSE_KEY'] || '',
    'api-username': process.env['DISCOURSE_USER'] || ''
  },
  baseURL: 'https://answers.netlify.com'
})
export const axiosNetlify = axios.create({
  baseURL: 'https://api.netlify.com/api/v1'
})
export const axiosZendesk = axios.create({
  auth: {
    password: process.env['ZENDESK_PASSWORD'] || '',
    username: `${process.env['ZENDESK_USERNAME']}/token`
  },
  baseURL: `${process.env['ZENDESK_URL']}/api/v2`
})
export const invalidParamException = new ApiError('Failed to parse request because it contains invalid parameters', 400)