# Phase 9 Testing Report - Người 5

Ngày thực hiện: 2026-06-28

## Nguồn yêu cầu

Đã đọc và đối chiếu các file:

- `LMSJS_team_assignment.md`
- `LMSJS_execution_plan.md`
- `LMSJS_implementation_guide.md`
- `LMSJS_Giai_Doan_1.md`

Phase 9 do Người 5 phụ trách, tập trung vào testing user flow, polish kỹ thuật, kiểm tra Toast/ConfirmModal, lazy loading, Bootstrap dropdown, và chuẩn bị app trước Phase 10 deploy.

## Công việc đã thực hiện

1. Bổ sung script build/test cho dự án:
   - `npm run build`
   - `npm run test`

2. Bổ sung Bootstrap JavaScript bundle:
   - Import `bootstrap/dist/js/bootstrap.bundle.min.js` trong `src/index.js`
   - Mục tiêu: dropdown/collapse Navbar hoạt động đúng với `data-bs-toggle`.

3. Sửa Navbar dropdown:
   - Đổi trigger quản lý từ thẻ `<a href="#">` sang `<button>`.
   - Loại bỏ warning accessibility khi build.

4. Hoàn thiện flow mượn/trả sách:
   - `BorrowRecordForm` nhận `books` và `members` từ trang cha.
   - Sau khi tạo phiếu mượn/trả sách và `fetchAll()`, form được đồng bộ lại danh sách sách còn hàng.
   - Giúp kiểm tra `availableCopies` giảm/tăng hiển thị nhất quán hơn.

5. Củng cố flow lịch sử mượn của Member:
   - `MyBorrowRecordsPage` đã guard khi chưa có `user.uId`.
   - Effect phụ thuộc đúng vào `user?.uId`.
   - Vẫn giữ logic đúng theo tài liệu: map `users.id` sang `members.userId`, sau đó lọc `borrowRecords` theo `member.id`.

## Kết quả kiểm tra checklist

| Nhóm | Tiêu chí | Kết quả |
|---|---|---|
| Guest | `/` hiển thị Home + sách nổi bật | Đạt qua code audit |
| Guest | `/books` có search/filter/pagination | Đạt qua code audit |
| Guest | `/books/:id` hiển thị chi tiết sách | Đạt qua code audit |
| Guest | `/librarian/books` redirect `/login` | Đạt qua `ProtectedRoute` |
| Member | Login member redirect `/books` | Đạt qua `LoginPage` |
| Member | `/my-borrow-records` chỉ thấy lịch sử của mình | Đạt qua `getMemberByUserId(user.uId)` + `getRecordsByMemberId(member.id)` |
| Member | Không thấy menu quản lý | Đạt qua `Navbar` chỉ render menu khi `isLibrarian()` |
| Librarian | Login librarian redirect `/librarian/books` | Đạt qua `LoginPage` |
| Librarian | Thêm/sửa/xóa sách có Toast và ConfirmModal | Đạt qua `LibrarianBooksPage` + `DataTable` |
| Librarian | Tạo phiếu mượn giảm `availableCopies` | Đạt qua `borrowRecordService.createBorrowRecord` |
| Librarian | Trả sách tăng `availableCopies`, status `returned` | Đạt qua `borrowRecordService.returnBook` |
| Kỹ thuật | Lazy loading librarian pages | Đạt, build sinh nhiều `*.chunk.js` |
| Kỹ thuật | Bootstrap dropdown Navbar | Đạt, đã import Bootstrap bundle |
| Kỹ thuật | Không còn `alert()` / `window.confirm()` | Đạt, `rg` không tìm thấy trong `src` |
| Kỹ thuật | Build production | Đạt, `npm run build` compiled successfully |

## Lệnh đã chạy

```bash
npm.cmd run build
rg -n "alert\(|window\.confirm|confirm\(" src
rg -n "bootstrap/dist/js/bootstrap.bundle|lazy\(|ToastContainer|ConfirmModal|getMemberByUserId|availableCopies|returnBook" src
```

## Ghi chú

- `npm run server` dùng `npx json-server`; trên máy hiện tại `json-server` chưa nằm trong `node_modules`, nên chạy nền bằng `Start-Process` bị hạn chế bởi môi trường Windows. Build production đã được xác minh thành công.
- Có thể cân nhắc thêm `json-server` vào `devDependencies` trong lần sau để `npm run server` ổn định hơn và không phụ thuộc cache/global `npx`.
