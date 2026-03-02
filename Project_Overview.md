---
type: project
status: active
---

# "Artisan's Corner" - An E-commerce Platform for Handmade Goods

### **Project Overview**

**Case Study: Artisan's Corner**

The market for unique, handcrafted items is booming, but individual artisans often lack the technical skills to build their own standalone e-commerce sites. They need a centralized hub where they can set up a shop, list products, and reach customers without worrying about hosting, security, or payment processing.

As a **Full Stack Developer Intern**, you will build **Artisan's Corner**. This is not a standard single-seller shop; it is a **Multi-Vendor Marketplace**. This adds a layer of complexity: users can be Buyers, Sellers, or both. You will architect a system that allows artisans to manage their own inventories while providing customers with a unified shopping experience.

---

### **Key Objectives & Technical Architecture**

#### **Phase 1: Database Design & User Roles**

- **The Schema:** This is the backbone of the project. You need to model complex relationships.
    - `Users`: Can have roles (`Buyer`, `Vendor`, `Admin`).
    - `Products`: Must reference a specific `Vendor` ID.
    - `Orders`: Must link a `Buyer` to specific `Products`.
- **Vendor Onboarding:** Create a workflow where a standard user can "Become a Seller," creating a Store Profile (Name, Logo, Description).
- **Technology:** Use **MongoDB** (with Mongoose population for relationships) or **PostgreSQL** (for strict relational integrity).

#### **Phase 2: The Vendor Dashboard**

- **Product Management:** Build a dedicated protected route (`/dashboard/seller`) where vendors can perform CRUD operations on their products.
- **Image Handling:** Products need photos. You cannot store images directly in the database. Integrate **Cloudinary** or **AWS S3**. When a vendor uploads a photo, upload it to the cloud, get the URL, and save that URL in your database.
- **Analytics:** A simple chart showing the vendor's Sales History and Total Earnings.

#### **Phase 3: Shopping Cart & Checkout Logic**

- **State Management:** The Shopping Cart is a complex piece of state. It must persist even if the user refreshes the page.
    - _Approach:_ Use **Redux Toolkit** or **Context API** combined with `localStorage` to keep the cart data synced.
- **The Checkout Flow:**
    1. Review Cart Items.
    2. Input Shipping Address.
    3. Payment Processing.
- **Reviews & Ratings:** Implement a system allowing verified buyers to leave a 1-5 star rating and text review on products they have purchased.

#### **Phase 4: Payments & Monetization**

- **Payment Gateway:** Integrate **Stripe**. You will use the Stripe API to process credit card transactions securely.
- **Commission Logic:** The platform makes money by taking a cut (e.g., 5%).
    - _Calculation:_ If a product costs $100, the system must calculate the Platform Fee ($5) and the Vendor Payout ($95). (For the scope of this project, you can simulate the payout recording rather than automating bank transfers).

---

### **Prerequisites**

- **Languages:** JavaScript/TypeScript.
- **Frontend:** React.js, Redux (or Context API), Axios.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB or SQL.
- **Services:** Cloudinary (Images), Stripe (Payments).

---

### **Deliverables**

**1. The GitHub Repository**

- Clean code structure separating `controllers`, `models`, `routes`, and `middleware`.
- **Security:** Ensure no API keys (Stripe Secrets, Mongo URI) are committed. Use `.env` files.

**2. The Live Application**

- A fully functional deployed link.
- **Demo Credentials:** In your README, provide login details for a "Demo Vendor" and a "Demo Buyer" so the evaluator can test both sides of the marketplace.

**3. Database Schema Diagram**

- An image showing how Users, Products, Orders, and Reviews are connected.

---

### **Project Timeline & Deadlines**

- **Week 1: Architecture & Products**
    
    - _Goal:_ The Marketplace Foundation.
    - _Tasks:_ Setup Server. Design DB Schema. Build Auth (Login/Register). Implement Image Upload to Cloudinary. Build the "Add Product" API.
- **Week 2: Frontend & Dashboards**
    
    - _Goal:_ Visualizing the Store.
    - _Tasks:_ Build the Product Listing Page (Grid view). Build the Individual Product Detail page. Construct the Vendor Dashboard (Table view of their products).
- **Week 3: Cart & Orders**
    
    - _Goal:_ The Transaction Flow.
    - _Tasks:_ Implement "Add to Cart" logic (Redux/Context). Build the Cart Page (Update quantities, remove items). Design the Order Schema to track status (Processing, Shipped).
- **Week 4: Payments & Reviews**
    
    - _Goal:_ Closing the Loop.
    - _Tasks:_ Integrate Stripe Payment Intent. On successful payment, create the Order record and clear the Cart. Implement the Review system. Final Deployment.

## 🧠 Decisions
(Why you chose certain approaches)

## 📚 Learnings
(What you learned from this project)