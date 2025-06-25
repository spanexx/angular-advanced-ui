# 🧱 Angular Advanced UI Components (Showcase)

This project is an end-to-end implementation of a reusable, configurable **Advanced Data Table component** in Angular, connected to a real backend API using Node.js, Express, and MongoDB.

## 🔧 Features

### Angular Frontend

* ✅ Standalone Angular component (`standalone: true`)
* ✅ Pagination, sorting, filtering (client and server-side)
* ✅ Material design (Angular Material)
* ✅ Configurable columns and filter behavior
* ✅ Observable-based data service

### Express Backend

* ✅ MongoDB with Mongoose schema for `DataItem`
* ✅ API: `/api/data?page=0&size=10&sort=name,asc&filter[category]=Alpha`
* ✅ Regex-based filtering, pagination, and sorting
* ✅ Easy-to-extend architecture

---

## 📁 Project Structure

### 🧩 Component Modules (Current & Upcoming)

| Component             | Status         | Description                                         |
| --------------------  | -------------  | --------------------------------------------------- |
| `advanced-data-table` | ✅ In Progress | Paginated, sortable, filterable data table          |
| `dynamic-form`        | ✅ In Progress |  Schema-driven reactive forms                       |
| `stepper-wizard`      | ✅ In Progress |  UI wizard with validation                          |
| `modal-service`       | 🚧 Coming Soon | Centralized modal service with injectable config    |
| `smart-search-bar`    | 🚧 Coming Soon | Intelligent search input with debounce/autocomplete |
| `infinite-scroll`     | 🚧 Coming Soon | Lazy-loaded infinite scroll directive/component     |
| `file-upload-zone`    | 🚧 Coming Soon | Drag-and-drop file upload with preview              |
| `notification-system` | ✅ In Progress | Toast/snackbar system with global injection         |
| `editable-grid`       | 🚧 Coming Soon | Grid/table with inline editing                      |
| `chat-component`      | ✅ In Progress | A chat UI with message input, bubbles, timestamps   |
| `filter-builder`      | 🚧 Coming Soon | Visual query builder for dynamic filtering          |

```tree
angular-advanced-ui/
├── apps/
│   └── demo-app/                 # Showcases all components
├── projects/
│   ├── advanced-data-table/     # ✅ In Progress
│   ├── dynamic-form/            # ✅ In Progress
│   ├── stepper-wizard/          # ✅ In Progress
│   ├── modal-service/           # 🚧 Coming Soon
│   ├── smart-search-bar/        # 🚧 Coming Soon
│   ├── infinite-scroll/         # 🚧 Coming Soon
│   ├── file-upload-zone/        # 🚧 Coming Soon
│   ├── notification-system/     # ✅ In Progress
│   ├── editable-grid/           # 🚧 Coming Soon
│   ├── chat-component/          # ✅ In Progress
│   └── filter-builder/          # 🚧 Coming Soon
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── seeds/
│   └── app.js
├── README.md
└── package.json
```

---

## 🚀 Getting Started

### 1. Frontend (Angular)

```bash
npm install
npm start
```

Navigate to `http://localhost:4200` to explore the demo app.

### 2. Backend (Node.js + MongoDB)

```bash
cd backend
npm install
node app.js
```

Environment variable: `MONGO_URI` (default: `mongodb://localhost:27017/yourdb`)

### 3. Seed Data

```bash
cd backend
node seeds/dataSeeder.js
```

---

## 🧪 API Example

```http
GET /api/data?page=1&size=20&sort=name,asc&filter[category]=Beta
```

Response:

```json
{
  "data": [ { "name": "Item 1", ... }, ... ],
  "total": 50
}
```

---

## 📦 Technologies

* Angular 17 (standalone components)
* Angular Material & CDK
* RxJS & Observables
* Node.js, Express
* MongoDB, Mongoose
* SCSS & TailwindCSS ready

---

## 🛠️ Developer Notes

* The frontend `DataTableService` uses `HttpClient` with observable streams.
* Filtering uses `filter[key]=value` format.
* Backend uses RegExp search (`/value/i`) for flexible filtering.
* Data is paginated and sorted on the server.

---

## 📚 Next Improvements

* 🔍 Add global search bar
* ✍️ Add row editing
* 🧩 Add export to CSV / Excel
* 🌐 Internationalization (i18n)
* 🔐 Add authentication

---

## 🤝 Contribution

1. Fork this repo
2. Create a feature branch
3. Submit a pull request

---

## 📄 License

spanexx © Victor Chidera Ani
