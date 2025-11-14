# Hướng dẫn Setup Google Sheet để nhận dữ liệu RSVP

## Bước 1: Tạo Google Sheet

1. Tạo một Google Sheet mới tại https://sheets.google.com
2. Đặt tên Sheet (ví dụ: "RSVP Wedding")
3. Tạo header ở dòng đầu tiên với các cột:
   - A1: Tên
   - B1: Số điện thoại
   - C1: Lời chúc
   - D1: Xác nhận tham dự
   - E1: Thời gian

## Bước 2: Tạo Google Apps Script

1. Trong Google Sheet, click vào **Extensions** > **Apps Script**
2. Xóa code mặc định và paste code sau:

```javascript
function doPost(e) {
  try {
    // Lấy dữ liệu từ request
    const data = JSON.parse(e.postData.contents);
    
    // Mở Google Sheet (thay 'YOUR_SHEET_ID' bằng ID của Sheet bạn)
    const sheet = SpreadsheetApp.openById('YOUR_SHEET_ID').getActiveSheet();
    
    // Thêm dữ liệu vào Sheet
    sheet.appendRow([
      data.name || '',
      data.phone || '',
      data.wishes || '',
      data.attendance || '',
      data.timestamp || new Date().toLocaleString('vi-VN')
    ]);
    
    // Trả về response thành công
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Trả về lỗi nếu có
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Bước 3: Lấy Sheet ID

1. Trong Google Sheet, xem URL trên thanh địa chỉ
2. URL có dạng: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`
3. Copy phần `YOUR_SHEET_ID` (phần giữa `/d/` và `/edit`)
4. Thay `YOUR_SHEET_ID` trong code Apps Script bằng ID vừa copy

## Bước 4: Deploy Web App

1. Trong Apps Script editor, click **Deploy** > **New deployment**
2. Click icon **Select type** > chọn **Web app**
3. Điền thông tin:
   - **Description**: "RSVP Form Handler"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone" (hoặc "Anyone with Google account" nếu muốn bảo mật hơn)
4. Click **Deploy**
5. **Copy URL** được tạo ra (sẽ có dạng: `https://script.google.com/macros/s/.../exec`)

## Bước 5: Cập nhật URL trong code

1. Mở file `js/custom.js`
2. Tìm dòng: `const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL';`
3. Thay `YOUR_GOOGLE_SCRIPT_URL` bằng URL bạn vừa copy từ bước 4
4. Lưu file

## Bước 6: Test

1. Mở trang web và điền form RSVP
2. Click "Gửi Lời Chúc"
3. Kiểm tra Google Sheet xem dữ liệu đã được thêm chưa

## Lưu ý:

- Nếu chọn "Anyone" trong Who has access, bạn cần authorize script lần đầu
- Script sẽ tự động thêm dữ liệu vào dòng tiếp theo trong Sheet
- Mỗi lần submit form, dữ liệu sẽ được thêm vào Sheet tự động

## Troubleshooting:

- Nếu dữ liệu không xuất hiện: Kiểm tra lại Sheet ID và URL
- Nếu gặp lỗi authorization: Chạy lại script một lần trong Apps Script editor để authorize
- Nếu vẫn không hoạt động: Kiểm tra Console trong browser (F12) để xem lỗi

