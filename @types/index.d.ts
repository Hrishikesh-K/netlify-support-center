// noinspection JSClassNamingConvention

export interface _DPost {
  created_at : string
  has_accepted_answer : boolean
  id : number
  reply_count : number
  tags : Array<string>
  title : string
  views : number
}
export interface _NAccount {
  id : string
  name : string
  priority : number
  type : string
}
export interface _NSite {
  custom_domain? : null | string | undefined
  id : string
  name : string
  selected : boolean
}
export interface _NUser {
  accounts : Array<_NAccount>
  avatar_url : string
  email :  string
  full_name : string
  id : string
  priority : number
  loading : boolean
}
export interface _SpStatus {
  page : {
    url:  string
  }
  status : {
    description : 'All Systems Operational' | 'Major System Outage' | 'Minor Service Outage' | 'Partial System Outage' | 'Partially Degraded Service' | 'Service Under Maintenance'
    indicator : 'critical' | 'maintenance' | 'major' | 'minor' | 'none'
  }
}
export interface _UiFile {
  base64 : string
  name : string
  md5 : string
}
export interface _UiSupportCategory {
  id : string
  name : string
  selected : boolean
}
export interface _UiToast {
  id : string
  text : string
  variant? : 'error' | 'info' | 'success' | 'warn'
}
export interface _ZdComment {
  attachments : Array<{
    file_name : string
    id : number
    mapped_content_url : string
    size : number
  }>
  author_id : number
  body : string
  created_at : string
  id : number
  public : boolean
}
export interface _ZdTicket {
  collaborator_ids : Array<number>
  comments : Array<_ZdComment>
  created_at : string
  id : number
  loading : boolean
  requester_id : number
  status : 'closed' | 'new' | 'open' | 'pending' | 'solved'
  subject : string
  updated_at : string
}
export interface _ZdTicketList {
  next_page : null | string
  tickets : Array<_ZdTicket>
}
export interface _ZdUser {
  email : string
  external_id : string
  id : number
  loading : boolean
  name : string
  organization_id : number
}