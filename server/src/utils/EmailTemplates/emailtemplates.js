export const emailTemplates = {
  welcome: (username,email) => `<div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);">
  <!-- Simple clean header -->
  <div style="background: #4a89dc; padding: 25px; text-align: left;">
    <!-- Logo aligned to top left -->
    <img src="https://cdn.discordapp.com/attachments/1368862317877530684/1373680257604915311/App_Icon__2_-removebg-preview.png?ex=682d452f&is=682bf3af&hm=e6f65a7ba97c7dcd68d784690a9598f7f61534bc0b5aafc35aa3d8b57e7025cd&" alt="One1app" style="max-width: 100px;">
    
    <!-- Welcome text -->
    <h1 style="color: white; margin-top: 20px; font-size: 28px; font-weight: 600;">
      Welcome to One1app, ${username}!
    </h1>
    
    <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; line-height: 1.5; margin-top: 12px;">
      Your all-in-one platform to build, manage, and grow your online presence is ready.
    </p>
  </div>

  <!-- Main content area with clean white background -->
  <div style="background-color: #ffffff; padding: 30px 25px;">
    <!-- Value proposition section -->
    <div style="text-align: center; margin: 10px 0 30px;">
      <p style="color: #444; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
        We're excited to help you streamline your workflow and unlock your full potential.
      </p>
      
      <!-- CTA Button -->
      <a href="https://one1app.com/dashboard" style="display: inline-block; background: #4a89dc; color: white; padding: 12px 28px; border-radius: 4px; text-decoration: none; font-weight: 500; font-size: 16px;">
        Get Started Now
      </a>
    </div>
    
    <!-- Key features with icons in circles -->
    <div style="margin: 35px 0; display: flex; justify-content: space-between; gap: 15px; flex-wrap: wrap;">
      <!-- Feature 1 -->
      <div style="flex: 1; min-width: 150px; text-align: center; padding: 15px 10px;">
        <div style="width: 60px; height: 60px; background: #4a89dc; border-radius: 50%; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center;">
          <img src="https://cdn-icons-png.flaticon.com/512/1162/1162499.png" alt="Build" width="30" height="30" style="filter: brightness(0) invert(1);">
        </div>
        <h3 style="color: #333; font-size: 16px; margin-bottom: 5px; font-weight: 500;">Build</h3>
        <p style="color: #666; font-size: 14px; line-height: 1.4;">Create beautiful online experiences</p>
      </div>
      
      <!-- Feature 2 -->
      <div style="flex: 1; min-width: 150px; text-align: center; padding: 15px 10px;">
        <div style="width: 60px; height: 60px; background: #4a89dc; border-radius: 50%; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center;">
          <img src="https://cdn-icons-png.flaticon.com/512/2521/2521826.png" alt="Manage" width="30" height="30" style="filter: brightness(0) invert(1);">
        </div>
        <h3 style="color: #333; font-size: 16px; margin-bottom: 5px; font-weight: 500;">Manage</h3>
        <p style="color: #666; font-size: 14px; line-height: 1.4;">Streamline your workflow</p>
      </div>
      
      <!-- Feature 3 -->
      <div style="flex: 1; min-width: 150px; text-align: center; padding: 15px 10px;">
        <div style="width: 60px; height: 60px; background: #4a89dc; border-radius: 50%; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center;">
          <img src="https://cdn-icons-png.flaticon.com/512/2405/2405283.png" alt="Grow" width="30" height="30" style="filter: brightness(0) invert(1);">
        </div>
        <h3 style="color: #333; font-size: 16px; margin-bottom: 5px; font-weight: 500;">Grow</h3>
        <p style="color: #666; font-size: 14px; line-height: 1.4;">Expand your presence</p>
      </div>
    </div>
    
    <!-- Social Media Section with minimal styling - icons in circles -->
    <div style="margin: 35px 0; text-align: center; border-top: 1px solid #eee; padding-top: 25px;">
      <p style="color: #4a89dc; font-weight: 500; margin-bottom: 15px; font-size: 16px;">Connect With Us</p>
      <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
        <a href="https://instagram.com/one_1app" target="_blank" style="display: inline-block;">
          <div style="width: 40px; height: 40px; background: #e1306c; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" width="22" height="22" style="filter: brightness(0) invert(1);">
          </div>
        </a>
        <a href="https://facebook.com/profile.php?id=61566926891474" target="_blank" style="display: inline-block;">
          <div style="width: 40px; height: 40px; background: #1877f2; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" width="22" height="22" style="filter: brightness(0) invert(1);">
          </div>
        </a>
        <a href="https://youtube.com" target="_blank" style="display: inline-block;">
          <div style="width: 40px; height: 40px; background: #ff0000; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="YouTube" width="22" height="22" style="filter: brightness(0) invert(1);">
          </div>
        </a>
        <a href="https://linkedin.com/company/one1app" target="_blank" style="display: inline-block;">
          <div style="width: 40px; height: 40px; background: #0077b5; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="22" height="22" style="filter: brightness(0) invert(1);">
          </div>
        </a>
        <a href="https://twitter.com" target="_blank" style="display: inline-block;">
          <div style="width: 40px; height: 40px; background: #1da1f2; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter/X" width="22" height="22" style="filter: brightness(0) invert(1);">
          </div>
        </a>
        <a href="https://www.pinterest.com/one1app/?invite_code=eb38f2354386481989f4ddc12a3a8d4d&sender=976929481577187819" target="_blank" style="display: inline-block;">
          <div style="width: 40px; height: 40px; background: #e60023; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <img src="https://cdn-icons-png.flaticon.com/512/145/145808.png" alt="Pinterest" width="22" height="22" style="filter: brightness(0) invert(1);">
          </div>
        </a>
      </div>
    </div>
  </div>

  <!-- Simple Footer -->
  <div style="background: #f5f7fa; padding: 25px; text-align: center; border-top: 1px solid #eaeef3;">
    <img src="https://media.discordapp.net/attachments/1368862317877530684/1373680384088473670/We_Are_Here_for_you_To_build_manage_monetise__grow_online_business_._1.png?ex=682d454d&is=682bf3cd&hm=032bc513fa95c756d31906d05bba5e3ab17ff78d4ae6923dd6fed6c4d9a84721&=&format=webp&quality=lossless&width=1728&height=432" alt="One1app" style="max-width: 180px; margin-bottom: 15px;">
    
    <p style="font-size: 13px; color: #666; margin: 10px 0; line-height: 1.5;">
      © ${new Date().getFullYear()} One1app. All rights reserved.
    </p>
    
    <div style="margin-top: 10px;">
      <a href="https://one1app.com/unsubscribe/${email}" style="color: #4a89dc; text-decoration: none; font-size: 12px; margin: 0 8px;">Unsubscribe</a>
      <span style="color: #ddd;">|</span>
      <a href="https://one1app.com/privacy-policy" style="color: #4a89dc; text-decoration: none; font-size: 12px; margin: 0 8px;">Privacy Policy</a>
      <span style="color: #ddd;">|</span>
      <a href="https://one1app.com/contact" style="color: #4a89dc; text-decoration: none; font-size: 12px; margin: 0 8px;">Contact Us</a>
    </div>
  </div>
</div>`,

verification_otp: (otp) => {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 40px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
        <h2 style="color: #333333; margin-bottom: 20px;">🔐 Verify Your Email</h2>
        <p style="font-size: 16px; color: #555555;">Thank you for signing up! Please use the following One-Time Password (OTP) to verify your email address:</p>
        <div style="font-size: 28px; font-weight: bold; margin: 30px 0; color: #1a73e8; letter-spacing: 6px; text-align: center;">
          ${otp}
        </div>
        <p style="font-size: 14px; color: #777777;">This OTP is valid for the next 10 minutes. Do not share it with anyone.</p>
        <p style="font-size: 14px; color: #777777; margin-top: 30px;">If you did not request this, you can safely ignore this email.</p>
        <hr style="margin: 40px 0; border: none; border-top: 1px solid #eeeeee;" />
        <p style="font-size: 12px; color: #999999; text-align: center;">Need help? Contact support or visit our Help Center.</p>
      </div>
    </div>
  `;
}

}