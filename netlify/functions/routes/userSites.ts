import type {AxiosError} from 'axios'
import type {NextFunction, Request, Response} from 'express'
import type {_NSite} from '~/@types'
import {ApiError, axiosNetlify} from '~/server/data/constants'
export default function (request : Request, response : Response, next : NextFunction) {
  const sites : Array<_NSite> = []
  function allSites(page = 1) {
    return new Promise<void>(resolve => {
      axiosNetlify({
        headers: {
          authorization: `Bearer ${request.nf_token!.access_token}`
        },
        params: {
          filter: 'all',
          page
        },
        url: '/sites'
      }).then((siteResponse : {
        data : Array<_NSite>
      }) => {
        try {
          siteResponse.data.forEach(site => {
            sites.push({
              custom_domain: site.custom_domain,
              id: site.id,
              name: site.name,
              selected: false
            })
          })
        } catch {
          return next(new ApiError('Failed to parse user\'s sites from Netlify', 500))
        }
        if (sites.length >= 500 || siteResponse.data.length < 100) {
          return resolve()
        } else {
          return allSites(page + 1)
        }
      }, (siteResponseError : AxiosError) => {
        return next(new ApiError('Failed to fetch user\'s sites from Netlify', siteResponseError.response?.status))
      })
    })
  }
  allSites().then(() => {
    return response.status(200).json(sites.sort((firstSite, secondSite) => {
      return firstSite.name.localeCompare(secondSite.name, undefined, {
        numeric: true
      })
    }))
  })
}