# Welcome to EduCred our project for The Hedera Hackaton

## Project info

**Name**: EduCred
**URL**: https://henoc0.github.io/educred_main/

## Our Hedera Service and wyh we used ?
For EduCred, we leveraged Hedera File Service primarily for its immutable storage and consensus-based timestamping, ensuring academic credentials cannot be altered once recorded. 
*Transaction Types:* We executed `FileCreateTransaction()` to permanently store diplomas and certificates on-chain, and `FileContentsQuery()` to enable instant verification of academic credentials by employers and institutions.
*Economic Justification:* Hedera's predictable low fees—$0.05 to create permanent academic records and $0.0001 for verification queries—make digital credentialing accessible across Africa. This cost structure eliminates the financial barriers that prevent students from traditional certification services, while ABFT finality provides trusted, instant verification crucial for employment and further education opportunities.


## Deployment and setup instructions
For visualize tha app in local, here is what you have to do :
1. **Clone the Repository:** `git clone https://github.com/Henoc0/educred_main.git && cd educred_main`
2. **Install Dependencies:** `npm install`
3. **Configure Environment:** Test account ID and 
Private Key are provided in the DoraHacks submission text field for verification. Our supabase keys are already in the code.
4. **Launch Application:** `npm run dev`
**Running Environment:** The React frontend will launch on `http://localhost:8080` and connect to our pre-deployed backend on Render. Note: After the frontend loads, please allow a few seconds for the backend to fully connect and initialize its Hedera Testnet services before using the application.
**Language :** the application is actually in french because we are in a french country and we had to test with some collaborators. Please use the translator in your browser for use the application in english.



## Architecture Diagram
The ASCII diagram is not displaying correctly in the readme; please view it properly once you have the project locally.
┌─────────────────────────────────────────────────────────────────┐
│                      EDUCRED ARCHITECTURE                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────┐    HTTP/REST     ┌─────────────┐    Hedera SDK     ┌─────────────┐
│             │◄────────────────►│             │◄─────────────────►│   HEDERA    │
│  FRONTEND   │                  │   BACKEND   │                   │  BLOCKCHAIN │
│   (React)   │                  │  (Express)  │   FileCreateTx    │   (Testnet) │
│             │                  │             │──────────────────►│             │
└─────────────┘                  └─────────────┘                   └─────────────┘
       │                              │                                      │
       │                              │                                      │
       │ Supabase Client              │ Supabase Server                      │ HashScan
       │                              │                                      │
       ▼                              ▼                                      ▼
┌─────────────┐              ┌─────────────┐                        ┌─────────────┐
│   SUPABASE  │              │   SUPABASE  │                        │  HASHSCAN   │
│   CLIENT    │              │    ADMIN    │                        │   EXPLORER  │
│    AUTH     │              │    API      │                        │             │
└─────────────┘              └─────────────┘                        └─────────────┘



## Deployed Hedera IDs
*HEDERA_ACCOUNT_ID*="0.0.6874436"
*Hedera_adress*="0x1f8bf3582911cc671a84cbf31d90279fa140dc00"
