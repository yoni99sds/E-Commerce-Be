import User from "../models/User.js";

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@shop.com";

    // CHECK IF ADMIN EXISTS
    const existingAdmin = await User.findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists");
      return;
    }

    // CREATE ADMIN
    const adminUser = new User({
      name: "System Admin",
      email: adminEmail,
      password:
        process.env.ADMIN_PASSWORD || "admin123",
      role: "admin",
    });

    await adminUser.save();

    console.log("✅ Admin seeded successfully");
    console.log(`📧 Email: ${adminEmail}`);
  } catch (error) {
    console.error("❌ Seeder error:", error.message);
  }
};

export default seedAdmin;