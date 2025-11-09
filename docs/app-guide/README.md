# Smart App User Guide (Draft)

1. **Device Setup**
   - Enable developer options and USB debugging on your Android handset.
   - Connect via USB and confirm `adb devices` lists the phone.

2. **Start Expo Dev Server**
   - Run `bun run start` or `npm run start` inside the `app/` directory.
   - Launch Expo Go on the device, choose the LAN option, and scan the QR code.

3. **Initial Configuration**
   - Navigate to Settings → Backend Endpoint and input the FastAPI server URL.
   - Sign in to sync preferences and building context.

4. **Scanning Workflow**
   - Use the Dashboard to trigger barcode scans or packaging capture.
   - Review the halal/haram verdict, evidence, and recommended next steps.

5. **Chatbot Assistant**
   - Access the Halal Advisor chatbot for clarifications on ingredients, E-codes, or certification bodies.

6. **Support**
   - Refer to troubleshooting section for connectivity, camera, or inference delays (to be detailed).

