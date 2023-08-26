// ==UserScript==
// @name         Amazon Invoice Download All
// @icon         https://www.amazon.co.uk/favicon.ico
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @description  Download all invoices
// @author       HR
// @include      /.*\.amazon\.co\.uk\/gp\/.*\/order\-history.*/
// @include      /.*\.amazon\.co\.uk\/your\-orders\/.*/
// @grant        none
// ==/UserScript==

;(function () {
  'use strict'
  var $ = window.jQuery;
  const INVOICE_DLINK_TXT = 'Invoice';
  const INVOICE_API_EP =
    'https://www.amazon.co.uk/gp/shared-cs/ajax/invoice/invoice.html?relatedRequestId=&isADriveSubscription=&isBookingOrder=0&orderId=';
  const ORDER_SUMMARY_URL = 'https://www.amazon.co.uk/gp/css/summary/print.html/ref=oh_aui_ajax_invoice?ie=UTF8&orderID=';//203-6502956-3604346
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
  `;

  $('h1').append(downloadButton);
  $('#downloadInvoicesButton').click(() => {
    const orders = $('.order-card');
    console.log(orders);
    orders.each(getOrderInvoice);
  });

  async function getOrderInvoice (idx, item) {
    console.log(item);
    var elt = $(item);
    const idelt = elt.find('.yohtmlc-order-id');
    const orderId = $($(idelt).children()[1]).text().trim();

    const invReqURI = INVOICE_API_EP + orderId;
    console.log(orderId, invReqURI);

    const invRes = await fetch(invReqURI);
    const invHtml = $(await invRes.text());

    const dlinkEls = invHtml.find(`a:contains('${INVOICE_DLINK_TXT}')`);
    const dlinks = dlinkEls
      .map(function () {
        // Form full download url
        return window.location.origin + $(this).attr('href')
      })
      .get();

    dlinks.forEach((dl, idx) => downloadAs(dl, `Amazon-order-${orderId}--${idx}.pdf`));
  };

  async function downloadAs (url, filename) {
    const f = await fetch(url);
    const b = await f.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b);
    a.setAttribute('download', filename);
    a.click();
  };
})();