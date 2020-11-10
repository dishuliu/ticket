import React, { PropTypes } from 'react'
import DocumentTitle from 'react-document-title'
import translate from './i18n/translate'
import {supportEmail} from '../config'

function Error({t}) {
  return (
    <div className="jumbotron">
      <DocumentTitle title='404 - LeanTicket' />
      <h1>{t('pageNotExist')}</h1>
      <p>{t('pageNotExistInfo')}</p>
      <p>{t('contactUs')} <a href={`mailto:${supportEmail}`}>{supportEmail}`</a></p>
    </div>
  )
}

Error.propTypes = {
  t: PropTypes.func
}

export default translate(Error)