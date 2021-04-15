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
  const sleepInterval = 2200
  const invLinkTxt = 'Invoice'
  const invEndpoint = 'https://www.amazon.co.uk/gp/shared-cs/ajax/invoice/invoice.html?relatedRequestId=&isADriveSubscription=&isBookingOrder=0&orderId='
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
  $('#downloadInvoicesButton').click(() => downloadAll())

  function downloadAll () {
    let orders = $('.order-info')

    orders.each(function (i) {
      const el = $(this)
      const details = el
        .find('.value')
        .map(function () {
          return $(this).text().trim()
        })
        .get()
        .join(' ')
      const invLink = el.find(`a:contains('${invLinkTxt}')`)
      // Not found
      if (!invLink.length) return

      invLink[0].click()
      
    })

    // function finda (txt) {
    //   let finds = Array.from(document.querySelectorAll('a')).filter(el =>
    //     el.textContent.includes(txt)
    //   )
    //   console.log(txt + ': ' + finds.length)
    //   return finds
    // }

    // function downloada (txt) {
    //   finda(txt).forEach((el, i, arr) => {
    //     console.log(`Downloading ${txt}...`, el.href)
    //     window.open(el.href, '_blank')
    //   })
    // }

    // finda('Invoice').forEach((e, i, arr) => {
    //   let sleep = 0
    //   setTimeout(() => {
    //     e.click()
    //     console.log(i, e)
    //     if (i === arr.length - 1) {
    //       setTimeout(() => downloada('Invoice 1'), 1000)
    //       setTimeout(() => downloada('Invoice 2'), 2000)
    //     }
    //   }, sleep)
    //   sleep += sleepInterval
    // })
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
