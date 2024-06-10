const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const AWS = require("aws-sdk");

// multer middleware
const multer = require("multer");
const upload = multer();

const CLOUDFLARE_TURNSTILE_SECRET_KEY =
  process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  SES: new AWS.SES({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "us-east-2",
  }),
});

router.post("/verify-turnstile-token", upload.none(), async (req, res) => {
  const body = req.body;
  const token = body["cf-turnstile-response"];

  let formData = new FormData();
  formData.append("secret", CLOUDFLARE_TURNSTILE_SECRET_KEY);
  formData.append("response", token);

  const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  const result = await fetch(url, {
    body: formData,
    method: "POST",
  });

  const outcome = await result.json();
  if (outcome.success) {
    // Send email...
    const { name, email, subject, message } = req.body;
    const emailResponse = await sendEmail(name, email, subject, message);
    if (!emailResponse) {
      res.status(500).json({ message: "Error sending email" });
    } else {
      res.status(200).json({ message: "Email successfully sent" });
    }
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const sendEmail = async (name, email, subject, message) => {
  const messageHtml = message.replace(/\n/g, "<br>"); // replace line breaks with <br>

  // Email markup
  const output = `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="https://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    
    <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!--<![endif]-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="format-detection" content="date=no" />
    <meta name="format-detection" content="address=no" />
    <meta name="format-detection" content="email=no" />
    <meta name="x-apple-disable-message-reformatting" />
    <link href="https://fonts.googleapis.com/css?family=Nunito+Sans:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900" rel="stylesheet" />
    <title>New Contact Request from ${name}</title>
        <style>
            html,
    body {
    margin: 0 !important;
    padding: 0 !important;
    min-height: 100% !important;
    width: 100% !important;
    -webkit-font-smoothing: antialiased;
    }

    * {
    -ms-text-size-adjust: 100%;
    }

    #outlook a {
    padding: 0;
    }

    .ReadMsgBody,
    .ExternalClass {
    width: 100%;
    }

    .ExternalClass,
    .ExternalClass p,
    .ExternalClass td,
    .ExternalClass div,
    .ExternalClass span,
    .ExternalClass font {
    line-height: 100%;
    }

    div[style*="margin: 14px 0"],
    div[style*="margin: 16px 0"] {
    margin: 0 !important;
    }

    table,
    td,
    th {
    mso-table-lspace: 0 !important;
    mso-table-rspace: 0 !important;
    border-collapse: collapse;
    }

    body,
    td,
    th,
    p,
    div,
    li,
    a,
    span {
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    mso-line-height-rule: exactly;
    }

    img {
    border: 0;
    outline: none;
    line-height: 100%;
    text-decoration: none;
    -ms-interpolation-mode: bicubic;
    }

    a[x-apple-data-detectors] {
    color: inherit !important;
    text-decoration: none !important;
    }

    .pc-gmail-fix {
    display: none;
    display: none !important;
    }

    @media (min-width: 621px) {
    .pc-lg-hide {
        display: none;
    }

    .pc-lg-bg-img-hide {
        background-image: none !important;
    }
    }

    @media (max-width: 620px) {
    .pc-project-body {
        min-width: 0px !important;
    }
    .pc-project-container {
        width: 100% !important;
    }
    .pc-sm-hide {
        display: none !important;
    }
    .pc-sm-bg-img-hide {
        background-image: none !important;
    }
    .pc-w620-padding-30-0-0-0 {
        padding: 30px 0px 0px 0px !important;
    }
    .pc-w620-fontSize-58px {
        font-size: 58px !important;
    }
    .pc-w620-padding-60-20-10-20 {
        padding: 60px 20px 10px 20px !important;
    }
    table.pc-w620-spacing-0-0-0-0 {
        margin: 0px 0px 0px 0px !important;
    }
    td.pc-w620-spacing-0-0-0-0,
    th.pc-w620-spacing-0-0-0-0 {
        margin: 0 !important;
        padding: 0px 0px 0px 0px !important;
    }

    .pc-w620-gridCollapsed-1 > tbody,
    .pc-w620-gridCollapsed-1 > tbody > tr,
    .pc-w620-gridCollapsed-1 > tr {
        display: inline-block !important;
    }
    .pc-w620-gridCollapsed-1.pc-width-fill > tbody,
    .pc-w620-gridCollapsed-1.pc-width-fill > tbody > tr,
    .pc-w620-gridCollapsed-1.pc-width-fill > tr {
        width: 100% !important;
    }
    .pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody,
    .pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody > tr,
    .pc-w620-gridCollapsed-1.pc-w620-width-fill > tr {
        width: 100% !important;
    }
    .pc-w620-gridCollapsed-1 > tbody > tr > td,
    .pc-w620-gridCollapsed-1 > tr > td {
        display: block !important;
        width: auto !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
    }
    .pc-w620-gridCollapsed-1.pc-width-fill > tbody > tr > td,
    .pc-w620-gridCollapsed-1.pc-width-fill > tr > td {
        width: 100% !important;
    }
    .pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody > tr > td,
    .pc-w620-gridCollapsed-1.pc-w620-width-fill > tr > td {
        width: 100% !important;
    }
    .pc-w620-gridCollapsed-1 > tbody > .pc-grid-tr-first > .pc-grid-td-first,
    pc-w620-gridCollapsed-1 > .pc-grid-tr-first > .pc-grid-td-first {
        padding-top: 0 !important;
    }
    .pc-w620-gridCollapsed-1 > tbody > .pc-grid-tr-last > .pc-grid-td-last,
    pc-w620-gridCollapsed-1 > .pc-grid-tr-last > .pc-grid-td-last {
        padding-bottom: 0 !important;
    }

    .pc-w620-gridCollapsed-0 > tbody > .pc-grid-tr-first > td,
    .pc-w620-gridCollapsed-0 > .pc-grid-tr-first > td {
        padding-top: 0 !important;
    }
    .pc-w620-gridCollapsed-0 > tbody > .pc-grid-tr-last > td,
    .pc-w620-gridCollapsed-0 > .pc-grid-tr-last > td {
        padding-bottom: 0 !important;
    }
    .pc-w620-gridCollapsed-0 > tbody > tr > .pc-grid-td-first,
    .pc-w620-gridCollapsed-0 > tr > .pc-grid-td-first {
        padding-left: 0 !important;
    }
    .pc-w620-gridCollapsed-0 > tbody > tr > .pc-grid-td-last,
    .pc-w620-gridCollapsed-0 > tr > .pc-grid-td-last {
        padding-right: 0 !important;
    }

    .pc-w620-tableCollapsed-1 > tbody,
    .pc-w620-tableCollapsed-1 > tbody > tr,
    .pc-w620-tableCollapsed-1 > tr {
        display: block !important;
    }
    .pc-w620-tableCollapsed-1.pc-width-fill > tbody,
    .pc-w620-tableCollapsed-1.pc-width-fill > tbody > tr,
    .pc-w620-tableCollapsed-1.pc-width-fill > tr {
        width: 100% !important;
    }
    .pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody,
    .pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody > tr,
    .pc-w620-tableCollapsed-1.pc-w620-width-fill > tr {
        width: 100% !important;
    }
    .pc-w620-tableCollapsed-1 > tbody > tr > td,
    .pc-w620-tableCollapsed-1 > tr > td {
        display: block !important;
        width: auto !important;
    }
    .pc-w620-tableCollapsed-1.pc-width-fill > tbody > tr > td,
    .pc-w620-tableCollapsed-1.pc-width-fill > tr > td {
        width: 100% !important;
    }
    .pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody > tr > td,
    .pc-w620-tableCollapsed-1.pc-w620-width-fill > tr > td {
        width: 100% !important;
    }
    }

    @media all {
    @font-face {
        font-family: "Nunito Sans";
        font-style: normal;
        font-weight: 600;
        src: url("https://fonts.gstatic.com/s/nunitosans/v15/pe1mMImSLYBIv1o4X1M8ce2xCx3yop4tQpF_MeTm0lfGWVpNn64CL7U8upHZIbMV51Q42ptCp5F5bxqqtQ1yiU4GCC5XvVUl.woff2")
        format("woff2");
    }
    @font-face {
        font-family: "Nunito Sans";
        font-style: normal;
        font-weight: 900;
        src: url("https://fonts.gstatic.com/s/nunitosans/v15/pe1mMImSLYBIv1o4X1M8ce2xCx3yop4tQpF_MeTm0lfGWVpNn64CL7U8upHZIbMV51Q42ptCp5F5bxqqtQ1yiU4Gfy5XvVUl.woff2")
        format("woff2");
    }
    @font-face {
        font-family: "Nunito Sans";
        font-style: normal;
        font-weight: 200;
        src: url("https://fonts.gstatic.com/s/nunitosans/v15/pe1mMImSLYBIv1o4X1M8ce2xCx3yop4tQpF_MeTm0lfGWVpNn64CL7U8upHZIbMV51Q42ptCp5F5bxqqtQ1yiU4GVilXvVUl.woff2")
        format("woff2");
    }
    @font-face {
        font-family: "Nunito Sans";
        font-style: normal;
        font-weight: 700;
        src: url("https://fonts.gstatic.com/s/nunitosans/v15/pe1mMImSLYBIv1o4X1M8ce2xCx3yop4tQpF_MeTm0lfGWVpNn64CL7U8upHZIbMV51Q42ptCp5F5bxqqtQ1yiU4GMS5XvVUl.woff2")
        format("woff2");
    }
    @font-face {
        font-family: "Nunito Sans";
        font-style: normal;
        font-weight: 800;
        src: url("https://fonts.gstatic.com/s/nunitosans/v15/pe1mMImSLYBIv1o4X1M8ce2xCx3yop4tQpF_MeTm0lfGWVpNn64CL7U8upHZIbMV51Q42ptCp5F5bxqqtQ1yiU4GVi5XvVUl.woff2")
        format("woff2");
    }
    @font-face {
        font-family: "Nunito Sans";
        font-style: italic;
        font-weight: 400;
        src: url("https://fonts.gstatic.com/s/nunitosans/v15/pe1kMImSLYBIv1o4X1M8cce4OdVisMz5nZRqy6cmmmU3t2FQWEAEOvV9wNvrwlNstMKW3Y6K5WMwXeVy3GboJ0kTHmqP92UpK_I.woff2")
        format("woff2");
    }
    @font-face {
        font-family: "Nunito Sans";
        font-style: normal;
        font-weight: 300;
        src: url("https://fonts.gstatic.com/s/nunitosans/v15/pe1mMImSLYBIv1o4X1M8ce2xCx3yop4tQpF_MeTm0lfGWVpNn64CL7U8upHZIbMV51Q42ptCp5F5bxqqtQ1yiU4GiClXvVUl.woff2")
        format("woff2");
    }
    @font-face {
        font-family: "Nunito Sans";
        font-style: italic;
        font-weight: 500;
        src: url("https://fonts.gstatic.com/s/nunitosans/v15/pe1kMImSLYBIv1o4X1M8cce4OdVisMz5nZRqy6cmmmU3t2FQWEAEOvV9wNvrwlNstMKW3Y6K5WMwXeVy3GboJ0kTHmq992UpK_I.woff2")
        format("woff2");
    }
    @font-face {
        font-family: "Nunito Sans";
        font-style: italic;
        font-weight: 600;
        src: url("https://fonts.gstatic.com/s/nunitosans/v15/pe1kMImSLYBIv1o4X1M8cce4OdVisMz5nZRqy6cmmmU3t2FQWEAEOvV9wNvrwlNstMKW3Y6K5WMwXeVy3GboJ0kTHmpR8GUpK_I.woff2")
        format("woff2");
    }
    @font-face {
        font-family: "Nunito Sans";
        font-style: italic;
        font-weight: 200;
        src: url("https://fonts.gstatic.com/s/nunitosans/v15/pe1kMImSLYBIv1o4X1M8cce4OdVisMz5nZRqy6cmmmU3t2FQWEAEOvV9wNvrwlNstMKW3Y6K5WMwXeVy3GboJ0kTHmoP92UpK_I.woff2")
        format("woff2");
    }
    @font-face {
        font-family: "Nunito Sans";
        font-style: italic;
        font-weight: 800;
        src: url("https://fonts.gstatic.com/s/nunitosans/v15/pe1kMImSLYBIv1o4X1M8cce4OdVisMz5nZRqy6cmmmU3t2FQWEAEOvV9wNvrwlNstMKW3Y6K5WMwXeVy3GboJ0kTHmoP8GUpK_I.woff2")
        format("woff2");
    }
    @font-face {
        font-family: "Nunito Sans";
        font-style: italic;
        font-weight: 900;
        src: url("https://fonts.gstatic.com/s/nunitosans/v15/pe1kMImSLYBIv1o4X1M8cce4OdVisMz5nZRqy6cmmmU3t2FQWEAEOvV9wNvrwlNstMKW3Y6K5WMwXeVy3GboJ0kTHmom8GUpK_I.woff2")
        format("woff2");
    }
    @font-face {
        font-family: "Nunito Sans";
        font-style: italic;
        font-weight: 700;
        src: url("https://fonts.gstatic.com/s/nunitosans/v15/pe1kMImSLYBIv1o4X1M8cce4OdVisMz5nZRqy6cmmmU3t2FQWEAEOvV9wNvrwlNstMKW3Y6K5WMwXeVy3GboJ0kTHmpo8GUpK_I.woff2")
        format("woff2");
    }
    @font-face {
        font-family: "Nunito Sans";
        font-style: normal;
        font-weight: 500;
        src: url("https://fonts.gstatic.com/s/nunitosans/v15/pe1mMImSLYBIv1o4X1M8ce2xCx3yop4tQpF_MeTm0lfGWVpNn64CL7U8upHZIbMV51Q42ptCp5F5bxqqtQ1yiU4G5ClXvVUl.woff2")
        format("woff2");
    }
    @font-face {
        font-family: "Nunito Sans";
        font-style: italic;
        font-weight: 300;
        src: url("https://fonts.gstatic.com/s/nunitosans/v15/pe1kMImSLYBIv1o4X1M8cce4OdVisMz5nZRqy6cmmmU3t2FQWEAEOvV9wNvrwlNstMKW3Y6K5WMwXeVy3GboJ0kTHmrR92UpK_I.woff2")
        format("woff2");
    }
    @font-face {
        font-family: "Nunito Sans";
        font-style: normal;
        font-weight: 400;
        src: url("https://fonts.gstatic.com/s/nunitosans/v15/pe1mMImSLYBIv1o4X1M8ce2xCx3yop4tQpF_MeTm0lfGWVpNn64CL7U8upHZIbMV51Q42ptCp5F5bxqqtQ1yiU4G1ilXvVUl.woff2")
        format("woff2");
    }
    }

        </style>
    </head>
    
    <body class="pc-font-alt" style="width: 100% !important;min-height: 100% !important;margin: 0 !important;padding: 0 !important;line-height: 1.5;color: #2D3A41;mso-line-height-rule: exactly;-webkit-font-smoothing: antialiased;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;font-variant-ligatures: normal;text-rendering: optimizeLegibility;-moz-osx-font-smoothing: grayscale;background-color: #ffffff;" bgcolor="#ffffff">
    <table class="pc-project-body" style="table-layout: fixed;min-width: 600px;background-color:#ffffff;" bgcolor="#ffffff" width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
        <tr>
        <td align="center" valign="top">
        <table class="pc-project-container" style="width: 600px; max-width: 600px;" width="600" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
            <td class="pc-w620-padding-30-0-0-0" style="padding: 20px 0px 20px 0px;" align="left" valign="top">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width: 100%;">
            <tr>
            <td valign="top">
                <!-- BEGIN MODULE: Personal Letter -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                <tr>
                <td class="pc-w620-spacing-0-0-0-0" style="padding: 0px 0px 0px 0px;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                    <tr>
                    <td valign="top" class="pc-w620-padding-60-20-10-20" style="padding: 20px 40px 20px 40px;border-radius: 0px;background-color: transparent;" bgcolor="transparent">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                          <td align="left" valign="top" style="padding: 0px 0px 40px 0px;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                          <tr>
                          <td valign="top" class="pc-font-alt pc-w620-fontSize-58px" align="left" style="padding: 0px 0px 0px 0px;mso-line-height: exactly;line-height: 107%;font-family: Nunito Sans, Arial, Helvetica, sans-serif;font-size: 62px;font-weight: 200;color: #000a28;text-align: left;text-align-last: left;font-variant-ligatures: normal;">
                              <div><span>You received a new contact request!</span>
                              </div>
                          </td>
                          </tr>
                          </table>
                          </td>
                      </tr>
                    </table>
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                        <td align="left" valign="top" style="padding: 0px 0px 0px 0px;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                        <td valign="top" class="pc-font-alt" align="left" style="padding: 0px 0px 0px 0px;mso-line-height: exactly;line-height: 160%;letter-spacing: 0px;font-family: Nunito Sans, Arial, Helvetica, sans-serif;font-size: 16px;font-weight: normal;color: #000a28;text-align: left;text-align-last: left;font-variant-ligatures: normal;">
                            <div><span style="font-weight: 700;font-style: normal;line-height: 250%;">Contact Details:</span>
                            </div>
                            <ol style="margin: 0; padding: 0 0 0 20px; list-style: arabic;">
                            <li><span style="font-weight: 700;font-style: normal;">Name:</span><span> ${name}</span>
                            </li>
                            <li><span style="font-weight: 700;font-style: normal;">Email:</span><span> ${email}</span>
                            </li>
                            </ol>
                            <div><span>﻿</span>
                            </div>
                            <div><span style="font-weight: 700;font-style: normal;line-height: 250%;">${subject}</span>
                            </div>
                            <div><span>﻿</span>
                            </div>
                            <div><span style="font-weight: 700;font-style: normal;line-height: 250%;">Message: </span><span><br/>${messageHtml}</span>
                            </div>
                        </td>
                        </tr>
                        </table>
                        </td>
                    </tr>
                    </table>
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                    <tr>
                        <td valign="top" style="padding: 40px 0px 40px 0px;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin: auto;">
                        <tr>
                        <td height="1" valign="top" style="line-height: 1px; font-size: 1px; border-bottom: 1px solid #cccccc;">&nbsp;</td>
                        </tr>
                        </table>
                        </td>
                    </tr>
                    </table>
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                        <td align="left" valign="top" style="padding: 0px 0px 20px 0px;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                        <td valign="top" class="pc-font-alt" align="left" style="padding: 0px 0px 0px 0px;mso-line-height: exactly;line-height: 20px;letter-spacing: -0.2px;font-family: Nunito Sans, Arial, Helvetica, sans-serif;font-size: 14px;font-weight: normal;color: #000a28;text-align: left;text-align-last: left;font-variant-ligatures: normal;">
                            <div><span>https://www.yuxuan-lin.com/</span>
                            </div>
                        </td>
                        </tr>
                        </table>
                        </td>
                    </tr>
                    </table>
                    </td>
                    </tr>
                </table>
                </td>
                </tr>
                </table>
                <!-- END MODULE: Personal Letter -->
            </td>
            </tr>         
            </table>
            </td>
        </tr>
        </table>
        </td>
        </tr>
    </table>
    <!-- Fix for Gmail on iOS -->
    <div class="pc-gmail-fix" style="white-space: nowrap; font: 15px courier; line-height: 0;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
    </div>
    </body>
  
    </html>  
    `;

  const mailOptions = {
    from: "Yuxuan-Lin.com Contact Form <k2awesomeness@gmail.com>",
    // to: ["k2awesomeness@gmail.com, linyuxuan127@gmail.com"],
    // to: ["k2awesomeness@gmail.com, kunal.gala16@gmail.com"],
    to: ["k2awesomeness@gmail.com"],
    replyTo: email,
    subject: "New Contact Request from " + name,
    html: output,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = router;
