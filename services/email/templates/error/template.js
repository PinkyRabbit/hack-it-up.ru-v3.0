const { websiteUrl, domain } = require('../../../../configs/email');

const body = ({ from, subjectText }) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Welcome</title>
    
</head>
<body style="color: #6b9c52; font: 14px/18px 'helvetica', 'arial', sans-serif; margin: 0;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" style="background-image: url('${websiteUrl}/images/email/bg.jpg'); padding-top: 20px;">
    <tbody>
      <tr>
        <td>
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="690">
            <tbody>
              <tr>
                <td align="center" width="100%">
                  <table align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="690">
                    <tbody>
                      <tr>
                        <td align="center" width="100%" style="color: #0e1724; font: 16px/28px 'helvetica', 'arial', sans-serif;">
                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="690">
                            <tbody>
                              <tr><td height="30"></td></tr>
                              <tr>
                                <td colspan="3" style="font-size: 1; line-height: 0; margin: 0; padding: 0;">
                                  <h2 style="color: #b347a6; font-size: 22px; font-weight: bold; line-height: 26px; margin: 0; padding: 0px 30px;">На сайте была обнаружена новая ошибка!</h2>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" width="100%">
                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tbody>
                              <tr bgcolor="#ffffff">
                                <td width="30"></td>
                                <td>
                                  <table align="center" border="0" cellpadding="0" cellspacing="0" width="630">
                                    <tbody>
                                      <tr><td colspan="3" height="20"></td></tr>
                                      <tr><td colspan="3">
                                        <div style="color: #404040; font-size: 16px; line-height: 20px; margin: 0; padding: 0;">Отправитель: ${from}</div>
                                        <hr>
                                        <div style="color: #404040; font-size: 14px; line-height: 20px; margin: 0; padding: 0;">${subjectText}</div>
                                      </td></tr>

                                        <tr><td colspan="3" height="30"></td></tr>
                                        
                                        <tr>
                                          <td>
                                            <table align="center" cellpadding="0" cellspacing="0" style="font-family: 'arial' , sans-serif;">
                                              <tbody>
                                                <tr>
                                                  <td align="center" style="font-size: 16px; line-height: 20px; margin: 0; text-align: center;">
                                                    <a href="${websiteUrl}" target="_blank" rel="noopener noreferrer" style="background: #77be53; border: 0 none; border-radius: 2px; color: #ffffff; display: block; font-size: 16px; font-weight: bold; padding: 14px 32px 14px 32px; text-decoration: none;">Перейти на главную страницу сайта <img src="${websiteUrl}/images/email/arrow.png" style="border: none;"></a>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>

                                        <tr><td colspan="3" height="40"></td></tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
</body>
</html>
`;

module.exports = body;
