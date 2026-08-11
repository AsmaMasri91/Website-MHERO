export type PolicyBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] };

export interface PolicySection {
  id: string;
  title: string;
  blocks: PolicyBlock[];
}

const SUPPORT_EMAIL =
  "[support.mhero@al-ghurair.com](mailto:support.mhero@al-ghurair.com?subject=Support%20Request)";
const COOKIE_POLICY_LINK = "[Cookie Policy](https://www.mhero.ae/en/cookie-policy)";

export const privacyPolicyIntro: PolicyBlock[] = [
  {
    type: "p",
    text: `Thank you for choosing to be part of our community at [The Al Ghurair Group] ("company", "we", "us", or "our"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at ${SUPPORT_EMAIL}.`,
  },
  {
    type: "p",
    text: `When you visit our website [www.mhero.ae](https://www.mhero.ae) ("Site") and use our services, you trust us with your personal information. We take your privacy very seriously. In this privacy notice, we describe our privacy policy. We seek to explain to you in the clearest way possible what information we collect, how we use it and what rights you have in relation to it. We hope you take some time to read through it carefully, as it is important. If there are any terms in this privacy policy that you do not agree with, please discontinue use of our Site and our services.`,
  },
  {
    type: "p",
    text: `This privacy policy applies to all information collected through our websites (such as [www.mhero.ae](https://www.mhero.ae)) and our mobile applications ("Apps"), and/or any related services, sales, marketing or events (we refer to them collectively in this privacy policy as the "Sites").`,
  },
  {
    type: "p",
    text: "Please read this privacy policy carefully as it will help you make informed decisions about sharing your personal information with us.",
  },
];

export const privacyPolicySections: PolicySection[] = [
  {
    id: "information-we-collect",
    title: "What Information Do We Collect?",
    blocks: [
      { type: "h3", text: "Personal information you disclose to us" },
      {
        type: "p",
        text: "In Short: We collect personal information that you provide to us such as name, address and contact information.",
      },
      {
        type: "p",
        text: "We collect personal information that you voluntarily provide to us when registering at the Sites or Apps, expressing an interest in obtaining information about us or our products and services, when participating in activities on the Sites (such as posting product and/or service reviews or entering competitions, contests or giveaways) or otherwise contacting us.",
      },
      {
        type: "p",
        text: "The personal information that we collect depends on the context of your interactions with us and the Sites, the choices you make and the products and features you use. The personal information we collect can include the following:",
      },
      {
        type: "p",
        text: "Name and Contact Data. We collect your first and last name, email address, postal address, phone number, and other similar contact data.",
      },
      {
        type: "p",
        text: "All personal information that you provide to us must be true, complete and accurate, and you must notify us of any changes to such personal information.",
      },
      { type: "h3", text: "Information automatically collected" },
      {
        type: "p",
        text: "In Short: Some information – such as IP address and/or browser and device characteristics – is collected automatically when you visit our websites.",
      },
      {
        type: "p",
        text: "We automatically collect certain information when you visit, use or navigate the Sites. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Site and other technical information. This information is primarily needed to maintain the security and operation of our Sites, and for our internal analytics and reporting purposes.",
      },
      {
        type: "p",
        text: `Like many businesses, we also collect information through cookies and similar technologies. You can find out more about this in our ${COOKIE_POLICY_LINK}.`,
      },
      { type: "h3", text: "Information collected through our Apps" },
      {
        type: "p",
        text: "In Short: We may collect information regarding your geo-location, mobile device, push notifications, and Facebook permissions when you use our apps.",
      },
      { type: "h3", text: "Information collected from other Sources" },
      {
        type: "p",
        text: "In Short: We may collect limited data from public databases, marketing partners, social media platforms, and other outside sources.",
      },
      {
        type: "p",
        text: "We may obtain information about you from other sources, such as public databases, joint marketing partners, social media platforms (such as Facebook), as well as from other third parties. Examples of the information we receive from other sources include: social media profile information (your name, gender, birthday, email, current city, state and country, user identification numbers for your contacts, profile picture URL and any other information that you choose to make public); marketing leads and search results and links, including paid listings (such as sponsored links).",
      },
    ],
  },
  {
    id: "how-we-use-information",
    title: "How Do We Use Your Information?",
    blocks: [
      {
        type: "p",
        text: 'In Short: We process your information for purposes based on legitimate business interests, the fulfillment of our contract with you, compliance with our legal obligations, and/or your consent.',
      },
      {
        type: "p",
        text: 'We use personal information collected via our Sites for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests ("Business Purposes"), in order to enter into or perform a contract with you ("Contractual"), with your consent ("Consent"), and/or for compliance with our legal obligations ("Legal Reasons"). We indicate the specific processing grounds we rely on next to each purpose listed below.',
      },
      { type: "p", text: "We use the information we collect or receive:" },
      {
        type: "ul",
        items: [
          'To facilitate account creation and logon process with your Consent. If you choose to link your account with us to a third party account (such as your Facebook account), we use the information you allowed us to collect from those third parties to facilitate account creation and logon process. See the section below headed "Social Logins" for further information.',
          'To send you marketing and promotional communications for Business Purposes and/or with your Consent. We and/or our third party marketing partners may use the personal information you send to us for our marketing purposes, if this is in accordance with your marketing preferences. You can opt-out of our marketing emails at any time (see the "Your Privacy Rights" below).',
          "To send administrative information to you for Business Purposes, Legal Reasons and/or possibly Contractual. We may use your personal information to send you product, service and new feature information and/or information about changes to our terms, conditions, and policies.",
          "Fulfill and manage your orders for Contractual reasons. We may use your information to fulfill and manage your orders, payments, returns, and exchanges made through the Sites.",
          `To post testimonials with your Consent. We post testimonials on our Sites that may contain personal information. Prior to posting a testimonial, we will obtain your consent to use your name and testimonial. If you wish to update, or delete your testimonial, please contact us at ${SUPPORT_EMAIL} and be sure to include your name, testimonial location, and contact information.`,
          `Deliver targeted advertising to you for our Business Purposes and/or with your Consent. We may use your information to develop and display content and advertising (and work with third parties who do so) tailored to your interests and/or location and to measure its effectiveness. For more information, see our ${COOKIE_POLICY_LINK}.`,
          "Administer prize draws and competitions for our Business Purposes and/or with your Consent. We may use your information to administer prize draws and competitions when you elect to participate in competitions.",
          "Request Feedback for our Business Purposes and/or with your Consent. We may use your information to request feedback and to contact you about your use of our Sites.",
          "To protect our Sites for Business Purposes and/or Legal Reasons. We may use your information as part of our efforts to keep our Sites safe and secure (for example, for fraud monitoring and prevention).",
          "To enforce our terms, conditions and policies for Business Purposes, Legal Reasons and/or possibly Contractual.",
          "To respond to legal requests and prevent harm for Legal Reasons. If we receive a subpoena or other legal request, we may need to inspect the data we hold to determine how to respond.",
          "For other Business Purposes. We may use your information for other Business Purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Sites, products, services, marketing and your experience.",
        ],
      },
    ],
  },
  {
    id: "information-shared",
    title: "Will Your Information Be Shared With Anyone?",
    blocks: [
      {
        type: "p",
        text: "In Short: We only share information with your consent, to comply with laws, to protect your rights, or to fulfill business obligations.",
      },
      { type: "p", text: "We only share and disclose your information in the following situations:" },
      {
        type: "ul",
        items: [
          "Compliance with Laws. We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process, such as in response to a court order or a subpoena (including in response to public authorities to meet national security or law enforcement requirements).",
          "Vital Interests and Legal Rights. We may disclose your information where we believe it is necessary to investigate, prevent, or take action regarding potential violations of our policies, suspected fraud, situations involving potential threats to the safety of any person and illegal activities, or as evidence in litigation in which we are involved.",
          "Vendors, Consultants and Other Third-Party Service Providers. We may share your data with third party vendors, service providers, contractors or agents who perform services for us or on our behalf and require access to such information to do that work. Examples include: payment processing, data analysis, email delivery, hosting services, customer service and marketing efforts. We may allow selected third parties to use tracking technology on the Sites, which will enable them to collect data about how you interact with the Sites over time. This information may be used to, among other things, analyze and track data, determine the popularity of certain content and better understand online activity. Unless described in this Policy, we do not share, sell, rent or trade any of your information with third parties for their promotional purposes.",
          "Business Transfers. We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.",
          `Third-Party Advertisers. We may use third-party advertising companies to serve ads when you visit the Sites. These companies may use information about your visits to our Site(s) and other websites that are contained in web cookies and other tracking technologies in order to provide advertisements about goods and services of interest to you. See our ${COOKIE_POLICY_LINK} for further information.`,
          "Affiliates. We may share your information with our affiliates, in which case we will require those affiliates to honor this privacy policy. Affiliates include our parent company and any subsidiaries, joint venture partners or other companies that we control or that are under common control with us.",
          "Business Partners. We may share your information with our business partners to offer you certain products, services or promotions.",
          "With your Consent. We may disclose your personal information for any other purpose with your consent.",
          "Other Users. When you share personal information (for example, by posting comments, contributions or other content to the Sites) or otherwise interact with public areas of the Site [or App], such personal information may be viewed by all users and may be publicly distributed outside the Sites and our Apps in perpetuity. If you interact with other users of our Sites and register through a social network (such as Facebook), your contacts on the social network will see your name, profile photo, and descriptions of your activity. Similarly, other users will be able to view descriptions of your activity, communicate with you within our Sites, and view your profile.",
        ],
      },
    ],
  },
  {
    id: "cookies",
    title: "Do We Use Cookies And Other Tracking Technologies?",
    blocks: [
      {
        type: "p",
        text: "In Short: We may use cookies and other tracking technologies to collect and store your information.",
      },
      {
        type: "p",
        text: `We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our ${COOKIE_POLICY_LINK}.`,
      },
    ],
  },
  {
    id: "google-maps",
    title: "Do We Use Google Maps?",
    blocks: [
      { type: "p", text: "In Short: Yes, we use Google Maps for the purpose of providing better service." },
      {
        type: "p",
        text: "Our Sites use Google Maps APIs. You may find the Google Maps APIs Terms of Service here. To better understand Google's Privacy Policy, please refer to this link.",
      },
      {
        type: "p",
        text: "By using our Maps API Implementation, you agree to be bound by Google's Terms of Service. By using our implementation of the Google Maps APIs, you agree to allow us to gain access to information about you including personally identifiable information (such as usernames) and non-personally identifiable information (such as location). We will be collecting the following information: location, address, username, etc.",
      },
      {
        type: "p",
        text: 'For a full list of what we use information for, please see the previous sections titled "Use of Your Information" and "Disclosure of Your Information." You agree to allow us to obtain or cache your location. You may revoke your consent at any time. We use information about location in conjunction with data from other data providers.',
      },
      { type: "p", text: "The Maps APIs that we use store and access cookies and other information on your devices." },
    ],
  },
  {
    id: "social-logins",
    title: "How Do We Handle Your Social Logins?",
    blocks: [
      {
        type: "p",
        text: "In Short: If you choose to register or log in to our websites using a social media account, we may have access to certain information about you.",
      },
      {
        type: "p",
        text: "Our Sites offers you the ability to register and login using your third party social media account details (like your Facebook login). Where you choose to do this, we will receive certain profile information about you from your social media provider. The profile Information we receive may vary depending on the social media provider concerned, but will often include your name, e-mail address, friends list, profile picture as well as other information you choose to make public. If you login using Facebook, we may also request access to other permissions related to your account, such as friends, check-ins, and likes, and you may choose to grant or deny us access to each individual permission.",
      },
      {
        type: "p",
        text: "We will use the information we receive only for the purposes that are described in this privacy policy or that are otherwise made clear to you on the Sites. Please note that we do not control, and are not responsible for, other uses of your personal information by your third party social media provider. We recommend that you review their privacy policy to understand how they collect, use and share your personal information, and how you can set your privacy preferences on their sites and apps.",
      },
    ],
  },
  {
    id: "international-transfer",
    title: "Is Your Information Transferred Internationally?",
    blocks: [
      { type: "p", text: "In Short: We may transfer, store, and process your information in countries other than your own." },
      {
        type: "p",
        text: 'Our servers are located in United Arab Emirates. If you are accessing our Sites from outside United Arab Emirates, please be aware that your information may be transferred to, stored, and processed by us in our facilities and by those third parties with whom we may share your personal information (see "Disclosure of Your Information" above).',
      },
    ],
  },
  {
    id: "third-party-websites",
    title: "What Is Our Stance On Third-Party Websites?",
    blocks: [
      {
        type: "p",
        text: "In Short: We are not responsible for the safety of any information that you share with third-party providers who advertise, but are not affiliated with, our websites.",
      },
      {
        type: "p",
        text: "The Sites may contain advertisements from third parties that are not affiliated with us and which may link to other websites, online services or mobile applications. We cannot guarantee the safety and privacy of data you provide to any third parties. Any data collected by third parties is not covered by this privacy policy. We are not responsible for the content or privacy and security practices and policies of any third parties, including other websites, services or applications that may be linked to or from the Sites. You should review the policies of such third parties and contact them directly to respond to your questions.",
      },
    ],
  },
  {
    id: "retention",
    title: "How Long Do We Keep Your Information?",
    blocks: [
      {
        type: "p",
        text: "In Short: We keep your information for as long as necessary to fulfill the purposes outlined in this privacy policy unless otherwise required by law.",
      },
      {
        type: "p",
        text: "We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements). No purpose in this policy will require us keeping your personal information for longer than 3 years past the termination of your account.",
      },
      {
        type: "p",
        text: "When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize it, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.",
      },
    ],
  },
  {
    id: "information-safety",
    title: "How Do We Keep Your Information Safe?",
    blocks: [
      {
        type: "p",
        text: "In Short: We aim to protect your personal information through a system of organizational and technical security measures.",
      },
      {
        type: "p",
        text: "We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure. Although we will do our best to protect your personal information, transmission of personal information to and from our Sites is at your own risk. You should only access the services within a secure environment.",
      },
    ],
  },
  {
    id: "minors",
    title: "Do We Collect Information From Minors?",
    blocks: [
      { type: "p", text: "In Short: We do not knowingly collect data from or market to children under 18 years of age." },
      {
        type: "p",
        text: `We do not knowingly solicit data from or market to children under 18 years of age. By using the Sites, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent's use of the Sites and Apps. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we have collected from children under age 18, please contact us at ${SUPPORT_EMAIL}.`,
      },
    ],
  },
  {
    id: "privacy-rights",
    title: "What Are Your Privacy Rights?",
    blocks: [
      { type: "p", text: "In Short: You may review, change, or terminate your account at any time." },
      {
        type: "p",
        text: "If we are relying on your consent to process your personal information, you have the right to withdraw your consent at any time. Please note however that this will not affect the lawfulness of the processing before its withdrawal.",
      },
      { type: "h3", text: "Account Information" },
      { type: "p", text: "You may at any time review or change the information in your account or terminate your account by:" },
      {
        type: "ul",
        items: [
          "Logging into your account settings and updating your account",
          "Contacting us using the contact information provided below",
          "Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, some information may be retained in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our Terms of Use and/or comply with legal requirements.",
        ],
      },
      {
        type: "p",
        text: `Cookies and similar technologies: Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Sites. For further information, please see our ${COOKIE_POLICY_LINK}.`,
      },
      {
        type: "p",
        text: "Opting out of email marketing: You can unsubscribe from our marketing email list at any time by clicking on the unsubscribe link in the emails that we send or by contacting us using the details provided below. You will then be removed from the marketing email list – however, we will still need to send you service-related emails that are necessary for the administration and use of your account. You can also opt-out by:",
      },
      {
        type: "ul",
        items: [
          "Noting your preferences at the time you register your account with the Sites.",
          "Logging into your account settings and updating your preferences.",
          "Contacting us using the contact information provided below",
        ],
      },
    ],
  },
  {
    id: "policy-updates",
    title: "Do We Make Updates To This Policy?",
    blocks: [
      { type: "p", text: "In Short: Yes, we will update this policy as necessary to stay compliant with relevant laws." },
      {
        type: "p",
        text: 'We may update this privacy policy from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy policy, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy policy frequently to be informed of how we are protecting your information.',
      },
    ],
  },
  {
    id: "contact-us",
    title: "How Can You Contact Us About This Policy?",
    blocks: [
      {
        type: "p",
        text: `If you have any further questions or comments about us or our policies, email us at ${SUPPORT_EMAIL}.`,
      },
    ],
  },
];
