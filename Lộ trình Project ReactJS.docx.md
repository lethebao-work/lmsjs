# **Lộ trình Project ReactJS \+ JSON-Server trong 10 tuần**

(Cấu trúc 70% Frontend – 30% Client-Server & State Management)

# **Công nghệ đề xuất**

## **Frontend (70%)**

* ReactJS (Create React App)   
* React Router DOM   
* Bootstrap / React-Bootstrap   
* Axios   
* Redux Toolkit / Context API 

## **Client-Server & Mock Backend (30%)**

* JSON-Server   
* REST API giả lập   
* LocalStorage / SessionStorage 

## **Deployment**

* Netlify   
* Vercel   
* Render (JSON-Server) 

---

# **Mục tiêu môn học**

* Hiểu quy trình phát triển SPA hiện đại   
* Áp dụng kiến trúc component-based development   
* Tập trung trọng tâm vào ReactJS   
* Biết tổ chức frontend project thực tế   
* Biết làm việc với REST API   
* Rèn kỹ năng Git/GitHub và teamwork   
* Áp dụng AI tools đúng cách và minh bạch 

---

# **Yêu cầu chức năng tối thiểu**

## **Frontend**

* Responsive UI   
* Routing   
* CRUD pages   
* Component reusable   
* Form validation   
* Loading/Error handling   
* Search / Filter / Pagination   
* API integration   
* Global state management 

## **Client-Server**

* JSON-Server   
* RESTful APIs   
* CRUD dữ liệu   
* Fetch/Axios   
* Mock authentication 

---

# **Ví dụ đề tài**

* Coffee Shop Management   
* Book Store   
* Mini Ecommerce   
* Movie App   
* Library Management   
* Course Management   
* Event Booking   
* Task Management 

---

# **Kế hoạch triển khai 10 tuần**

# **Giai đoạn 1 — Project Analysis & React Foundation (Tuần 1–2)**

## **Tỷ trọng**

Frontend: 20%  
Client-Server: 5%  
---

# **Tuần 1 — Chọn đề tài & Phân tích yêu cầu**

## **Sinh viên cần làm**

### **Lập nhóm**

* 3–5 thành viên 

### **Chọn đề tài**

### **Phân tích**

* Problem Statement   
* User Roles   
* Functional Requirements   
* Non-functional Requirements 

### **Thiết kế sơ bộ**

* Sitemap   
* UI flow   
* Component draft 

---

## **Deliverables**

* Proposal PDF   
* Feature list   
* Sitemap   
* UI draft/wireframe 

---

## **Giảng viên đánh giá**

* Đề tài phù hợp React SPA   
* Có luồng nghiệp vụ rõ ràng   
* Có khả năng chia component/module 

---

# **Tuần 2 — React Setup & UI Structure**

## **Frontend focus**

### **Setup project**

npx create-react-app project-name  
cd project-name  
npm start  
---

### **Cài đặt thư viện**

npm install react-router-dom  
npm install bootstrap react-bootstrap  
npm install axios  
---

### **Import Bootstrap**

import 'bootstrap/dist/css/bootstrap.min.css';  
---

### **Implement**

* React Router   
* Layout structure   
* Header/Footer/Navbar   
* Routing structure 

---

## **Bắt buộc**

* JSX   
* ES6   
* Functional Components 

---

## **Client-Server focus**

### **Thiết kế mock database**

Ví dụ:  
{  
  "products": \[\],  
  "categories": \[\],  
  "users": \[\]  
}  
---

## **Deliverables**

* React source code   
* Routing structure   
* Mock database draft   
* GitHub repository 

---

## **Công cụ gợi ý**

* Create React App   
* GitHub   
* Figma   
* Draw.io 

---

# **Giai đoạn 2 — UI Components & React Development (Tuần 3–5)**

## **Tỷ trọng**

\= 35% tổng project  
---

# **Tuần 3 — Component Architecture & Bootstrap UI**

## **Sinh viên cần làm**

### **Implement**

* Bootstrap / React-Bootstrap   
* Responsive layout   
* Component structure 

---

## **Components bắt buộc**

components/  
 ├── Navbar  
 ├── Sidebar  
 ├── Footer  
 ├── ProductCard  
 ├── ProductList  
 ├── SearchBar  
 ├── Modal  
 ├── Form  
 └── Pagination  
---

## **Bắt buộc**

* Props   
* Component reuse   
* Grid system 

---

## **Deliverables**

* Responsive UI   
* Reusable components   
* UI demo 

---

# **Tuần 4 — State & Event Handling**

## **Sinh viên cần làm**

### **Implement**

* useState   
* Event handling   
* Controlled forms 

---

## **Chức năng**

* Search UI   
* Add/Edit/Delete UI   
* Modal interaction   
* Validation 

---

## **Bắt buộc**

* useState   
* onClick/onChange   
* Form handling 

---

## **Deliverables**

* Dynamic UI   
* Interactive forms   
* State management cơ bản 

---

# **Tuần 5 — Hooks & Context**

## **Sinh viên cần làm**

### **Implement**

* useEffect   
* useContext   
* Custom hooks cơ bản 

---

## **Chức năng**

* Shared state   
* Theme/cart/favorite   
* Data flow giữa components 

---

## **Khuyến khích**

* Context API   
* Component refactor   
* Reusable hooks 

---

## **Deliverables**

* Hook-based architecture   
* Shared state demo 

---

# **Giai đoạn 3 — Routing & Client-Server Communication (Tuần 6–8)**

## **Tỷ trọng**

\= 35% tổng project  
---

# **Tuần 6 — React Router & SPA Navigation**

## **Sinh viên cần làm**

### **Implement**

* React Router   
* Nested routes   
* Dynamic routes   
* 404 page 

---

## **Chức năng**

* Product detail   
* Route params   
* Navigation flow 

---

## **Bắt buộc**

* useParams   
* Link/NavLink   
* Protected route giả lập 

---

## **Deliverables**

* SPA navigation hoàn chỉnh   
* Routing workflow 

---

# **Tuần 7 — JSON-Server & API Integration**

## **Sinh viên cần làm**

### **Cài đặt JSON-Server**

npm install \-g json-server  
---

### **Chạy server**

json-server \--watch db.json \--port 3000  
---

### **Lưu ý với Create React App**

CRA mặc định chạy:  
http://localhost:3000  
Nên React app cần đổi port:  
PORT=3001 npm start  
Hoặc JSON-Server chạy:  
json-server \--watch db.json \--port 5000  
---

## **Implement**

* Fetch data   
* CRUD APIs   
* Axios integration 

---

## **CRUD bắt buộc**

* Create   
* Read   
* Update   
* Delete 

---

## **Bắt buộc**

* async/await   
* Loading state   
* Error handling 

---

## **Deliverables**

* Connected frontend-backend   
* CRUD workflow hoàn chỉnh 

---

# **Tuần 8 — Advanced Features & Optimization**

## **Sinh viên cần làm**

### **Implement**

* Search/filter   
* Pagination   
* Lazy loading   
* Suspense 

---

## **Khuyến khích**

* Dashboard   
* Toast notification   
* Dark mode 

---

## **Bắt buộc**

* React.lazy   
* Suspense   
* API optimization 

---

## **Deliverables**

* Optimized SPA   
* Full workflow integration 

---

# **Giai đoạn 4 — Redux, Deployment & Defense (Tuần 9–10)**

## **Tỷ trọng**

\= 10% tổng project  
---

# **Tuần 9 — Redux & Deployment**

## **Sinh viên cần làm**

### **Implement**

* Redux Toolkit hoặc Context API   
* Global state management 

---

## **Áp dụng cho**

* Cart   
* Auth   
* User state   
* Favorite 

---

## **Deployment**

### **Frontend**

* Netlify   
* Vercel 

### **JSON-Server**

* Render 

---

## **Deliverables**

* Deploy URL   
* Stable frontend   
* Redux integration 

---

# **Tuần 10 — Final Presentation & Defense**

## **Sinh viên trình bày**

* Problem   
* React architecture   
* Component structure   
* Routing flow   
* State management   
* API integration   
* Challenges   
* AI usage transparency 

---

## **Bắt buộc**

### **Mỗi thành viên:**

* Demo phần phụ trách   
* Giải thích component flow   
* Trả lời technical questions 

---

# **Cấu trúc chấm điểm**

(70% Frontend – 30% Client-Server)

| Hạng mục | Tỷ lệ |
| ----- | ----- |
| React Components & Architecture | 20% |
| Hooks & State Management | 15% |
| Routing & Navigation | 10% |
| Responsive UI/UX | 10% |
| API Integration & CRUD | 20% |
| JSON-Server Structure | 10% |
| Optimization & Lazy Loading | 5% |
| Deployment | 5% |
| Presentation & Teamwork | 5% |

---

# **Yêu cầu kỹ thuật bắt buộc**

## **Frontend**

* Functional Components   
* Hooks   
* React Router   
* Responsive UI   
* Form validation   
* Loading/Error handling   
* API abstraction 

## **Client-Server**

* JSON-Server   
* RESTful API   
* CRUD   
* Search/filter/pagination 

## **Git**

* GitHub repository   
* Branching strategy   
* Meaningful commits 

---

# **Mô hình phù hợp cho sinh viên**

## **Mức cơ bản**

* React \+ JSON-Server   
* Bootstrap   
* Context API 

## **Mức nâng cao**

* Redux Toolkit   
* Custom Hooks   
* Lazy Loading   
* Deploy production 

---

# **Gợi ý quản lý tiến độ**

## **Mỗi tuần**

* Submit source code   
* Demo 5–10 phút   
* Review trực tiếp với giảng viên 

---

# **Nên kiểm tra**

* Git commit history   
* Pull requests   
* Contribution từng thành viên   
* Milestone completion   
* AI usage transparency 

---

# **AI Integration Requirement (theo CLO9)**

## **Sinh viên phải ghi nhận**

### **AI tools đã dùng**

* [ChatGPT](https://chatgpt.com?utm_source=chatgpt.com)   
* [Gemini](https://gemini.google.com/app?utm_source=chatgpt.com)   
* [Grok](https://grok.com/?utm_source=chatgpt.com) 

### **Prompt đã sử dụng**

Ví dụ:  
"Generate React Bootstrap responsive navbar"

"Refactor this React component using Hooks"

"Create Redux Toolkit slice for cart management"

### **Minh bạch**

* phần code AI hỗ trợ   
* cách verify output AI   
* phần tự triển khai thêm

