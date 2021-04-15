// ==UserScript==
// @name         Amazon Invoice Download All
// @icon         https://www.amazon.co.uk/favicon.ico
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @description  Download all invoices
// @author       HR
// @include      /.*\.amazon\.co\.uk\/gp\/.*\/order\-history.*/
// @grant        none
// ==/UserScript==

;(function () {
  'use strict'
  const INVOICE_DLINK_TXT = 'Invoice'
  const INVOICE_API_EP =
    'https://www.amazon.co.uk/gp/shared-cs/ajax/invoice/invoice.html?relatedRequestId=&isADriveSubscription=&isBookingOrder=0&orderId='
  const downloadButton = `
    <span id="downloadInvoicesButton" class="a-declarative" style="right: 0; position: absolute;">
      <span class="a-button a-button-dark download-invoices-button" id="a-autoid-3">
        <span class="a-button-inner">
          <span class="a-button-text" role="button">
            Download Invoices
          </span>
        </span>
      </span>
    </span>
  `

  $('#controlsContainer > .top-controls').append(downloadButton)
  $('#downloadInvoicesButton').click(() => {
    const orders = $('.order-info')
    orders.each(getOrderInvoice)
  })

  async function getOrderInvoice (i) {
    const el = $(this)
    const filename =
      el
        .find('.value')
        .map(function () {
          return $(this)
            .text()
            .trim()
        })
        .get()
        .join(' ') + '.pdf'

    const orderId = el.find('bdi').text()
    const invReqURI = INVOICE_API_EP + orderId
    console.log(filename, orderId, invReqURI)

    const invRes = await fetch(invReqURI)
    const invHtml = $(await invRes.text())

    const dlinkEls = invHtml.find(`a:contains('${INVOICE_DLINK_TXT}')`)
    const dlinks = dlinkEls
      .map(function () {
        // Form full download url
        return window.location.origin + $(this).attr('href')
      })
      .get()
    console.log('dlinks', dlinks)

    dlinks.forEach(dl => downloadAs(dl, filename))
  }

  function downloadAs (url, filename) {
    fetch(url).then(function (t) {
      return t.blob().then(b => {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(b)
        a.setAttribute('download', filename)
        a.click()
      })
    })
  }
})()
