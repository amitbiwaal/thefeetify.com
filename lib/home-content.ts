import type { IconName } from '@/components/site/Icon'

type IconCard = { icon: IconName; title: string; text: string }
type TextCard = { title: string; text: string }

export const TRUST_ITEMS: { icon: IconName; label: string }[] = [
  { icon: 'shield', label: 'Adults only' },
  { icon: 'lock', label: 'Protected payouts' },
  { icon: 'globe', label: 'Sell worldwide' },
  { icon: 'check', label: 'No face needed' },
]

export const ABOUT_PARAGRAPHS = [
  "Feetify has been around for six years, and in a niche where new platforms appear and disappear all the time, that says a lot. It was created for one purpose only. Everyone visiting the Feetify website is already looking to buy feet pics, so you don't have to spend weeks building an audience before making your first sale. Upload your content, appear in search, and let interested buyers find you.",
  'The pricing model is worth paying attention to. Opening a seller account is completely free, and free sellers keep 80% of every sale. Upgrade to Premium and you keep 100%. Many competing platforms continue taking a commission every time you make a sale. On Feetify, that commission can drop to zero, no matter how much your earnings grow.',
  "Everything happens inside the platform. Buyers message you on Feetify, pay through Feetify, and receive their content through Feetify. There's no need to share your phone number, email address, payment app, or banking details with anyone. It may seem like a small feature, but it's one of the biggest reasons sellers stay safe. Most scam stories begin the moment someone asks to continue the conversation somewhere else.",
  "More than 500,000 members have already joined the platform. That's six years of buyers who know and trust Feetify and already have payment methods set up. A new marketplace can copy the design, but it can't copy years of trust or an established buyer community. That's why many new sellers receive their first sale within days instead of waiting months to get noticed.",
]

export const FEATURES: IconCard[] = [
  {
    icon: 'upload',
    title: 'Upload in batches',
    text: 'Upload an entire photo shoot in one go. Add captions to each image, then choose which ones stay free, which require payment, and which are reserved for subscribers only.',
  },
  {
    icon: 'dollar',
    title: 'Price it yourself',
    text: "You're in complete control of your pricing. Set the amount for every listing and update it whenever you want. There are no price limits or automatic discounts.",
  },
  {
    icon: 'message',
    title: 'Messages come to you',
    text: "Buyer requests arrive directly in your inbox. Discuss the details, agree on the order, and deliver everything through the same conversation. If a request isn't for you, simply decline it.",
  },
  {
    icon: 'tag',
    title: 'Tags do the finding',
    text: 'Add relevant tags to every upload. Buyers search by style, and the right tags help your content appear in their results. They never need to know who you are to find your profile.',
  },
  {
    icon: 'chart',
    title: 'Watch the balance build',
    text: "Every completed sale adds to your balance. Once you've reached the minimum payout amount, request a withdrawal and Feetify sends your earnings to you.",
  },
  {
    icon: 'card',
    title: 'Set a monthly rate',
    text: 'Offer subscribers ongoing access for one monthly price. Renewals happen automatically, giving you recurring income instead of selling the same content over and over.',
  },
]

export const LEGIT_POINTS: TextCard[] = [
  {
    title: 'Is Feetify legit or a scam',
    text: 'Yes, Feetify is a legitimate platform. It offers secure payments and gives sellers a trusted marketplace where they can safely connect with buyers looking for feet content.',
  },
  {
    title: 'What the reviews get right',
    text: "The design does feel a little dated, and that's a fair point. What many reviews overlook is the active buyer community, which is what actually helps sellers make consistent sales.",
  },
  {
    title: 'Someone I know will see it',
    text: 'Your face, real name, and personal details stay private. Buyers only see the username you created and the photos you choose to upload.',
  },
  {
    title: 'They will take it and not pay',
    text: "Your content stays locked until payment has been completed. Buyers can't access your photos first and decide whether they'll pay afterwards.",
  },
  {
    title: 'Is selling feet pics legal',
    text: "Yes, provided you're at least 18 years old and the content belongs to you. Every seller completes age verification before their account becomes active.",
  },
  {
    title: 'My feet are not good enough',
    text: "Every buyer has different preferences. Some like wide feet, others prefer narrow, flat, tattooed, natural, or polished. There's no perfect look you need before you can start selling.",
  },
]

export const STEPS: TextCard[] = [
  {
    title: 'Invent a seller identity',
    text: "Create a new email address and choose a username that doesn't reveal anything personal. It only takes a few minutes, but it's much easier to do it properly from the start.",
  },
  {
    title: 'Shoot near a window',
    text: "Natural daylight gives the best results. Use a clean floor or plain background, and change your angles so every photo doesn't look exactly the same.",
  },
  {
    title: 'Fill out the profile',
    text: "Use your strongest image as the profile photo. Add a short, honest description of what you offer, and clearly mention anything you don't provide to avoid future misunderstandings.",
  },
  {
    title: 'Put prices on everything',
    text: "Don't start by charging the lowest prices. Buyers looking only for the cheapest content usually negotiate the most and rarely become repeat customers.",
  },
  {
    title: 'Answer and deliver',
    text: 'Reply while buyers are still active on the site. Once payment is complete, deliver the content promptly. If someone comes back for a third purchase, offer them a monthly subscription.',
  },
]

export const CATEGORIES: IconCard[] = [
  {
    icon: 'camera',
    title: 'Single photos',
    text: "Individual photos are often a buyer's first purchase. Make sure this tier includes quality content because it's what convinces people to come back for more.",
  },
  {
    icon: 'stack',
    title: 'Bundles',
    text: 'Package six to twelve photos together. They take almost the same amount of effort to create but can sell for much more than individual images.',
  },
  {
    icon: 'play',
    title: 'Short clips',
    text: 'A few seconds of video can make a big difference. Videos usually sell for higher prices, and fewer sellers create them, leaving less competition.',
  },
  {
    icon: 'message',
    title: 'Custom orders',
    text: "Buyers tell you exactly what they want, and you create it for them. Custom requests often earn the highest prices because they're made specifically for one person.",
  },
  {
    icon: 'star',
    title: 'Subscriptions',
    text: "Charge a monthly fee for ongoing access to your content. It's one of the easiest ways to turn occasional buyers into regular, recurring income.",
  },
  {
    icon: 'tag',
    title: 'Styled sets',
    text: 'Bare feet, painted nails, soles, arches, heels, socks, sneakers, or pedicures. Buyers search using these terms, so accurate tags make your content much easier to discover.',
  },
]

export const DIFFERENCES: IconCard[] = [
  {
    icon: 'dollar',
    title: 'Commission that hits zero',
    text: 'Most platforms keep taking a percentage from every sale you make. With Feetify Premium, that commission disappears, so every extra sale stays in your pocket.',
  },
  {
    icon: 'users',
    title: 'Half a million already inside',
    text: "A marketplace is only as good as the people using it. Feetify has spent years building a large community of buyers, something new platforms simply can't create overnight.",
  },
  {
    icon: 'search',
    title: 'Everyone came for the same thing',
    text: "People visiting Feetify are already looking for feet content. Your listings aren't competing with unrelated creators because buyers are here with a clear purpose.",
  },
  {
    icon: 'filter',
    title: 'Follower count is irrelevant',
    text: "You don't need thousands of followers before making your first sale. Buyers discover content through search and filters, giving new sellers the same opportunity to be found.",
  },
]

type Cell = { text: string; tone: 'yes' | 'mid' | 'no' }

export const COMPARISON: { feature: string; cells: [Cell, Cell, Cell] }[] = [
  {
    feature: 'Commission taken',
    cells: [
      { text: '0% on Premium', tone: 'yes' },
      { text: '15%–25%', tone: 'mid' },
      { text: '0%, but higher unpaid risk', tone: 'no' },
    ],
  },
  {
    feature: 'Buyer verification',
    cells: [
      { text: 'Required', tone: 'yes' },
      { text: 'Depends on the platform', tone: 'mid' },
      { text: 'None', tone: 'no' },
    ],
  },
  {
    feature: 'Who is browsing',
    cells: [
      { text: 'Feet content buyers', tone: 'yes' },
      { text: 'Mixed audience', tone: 'mid' },
      { text: 'Random users', tone: 'no' },
    ],
  },
  {
    feature: 'Payment protection',
    cells: [
      { text: 'Included', tone: 'yes' },
      { text: 'Included', tone: 'yes' },
      { text: 'None', tone: 'no' },
    ],
  },
  {
    feature: 'Anonymity',
    cells: [
      { text: 'Built in', tone: 'yes' },
      { text: 'Partial', tone: 'mid' },
      { text: 'Up to you', tone: 'no' },
    ],
  },
  {
    feature: 'Face required',
    cells: [
      { text: 'No', tone: 'yes' },
      { text: 'Often expected', tone: 'no' },
      { text: 'Often expected', tone: 'no' },
    ],
  },
  {
    feature: 'How new sellers get found',
    cells: [
      { text: 'Search and filters', tone: 'yes' },
      { text: 'Follower count', tone: 'mid' },
      { text: 'Follower count', tone: 'mid' },
    ],
  },
  {
    feature: 'Scam exposure',
    cells: [
      { text: 'Low', tone: 'yes' },
      { text: 'Low', tone: 'yes' },
      { text: 'High', tone: 'no' },
    ],
  },
  {
    feature: 'Chargeback risk',
    cells: [
      { text: 'Covered', tone: 'yes' },
      { text: 'Covered', tone: 'yes' },
      { text: 'You handle it', tone: 'no' },
    ],
  },
  {
    feature: 'Time to first listing',
    cells: [
      { text: 'Under an hour', tone: 'yes' },
      { text: 'Under an hour', tone: 'yes' },
      { text: 'Instant', tone: 'yes' },
    ],
  },
]

export const USE_CASES: IconCard[] = [
  {
    icon: 'dollar',
    title: 'You want a bit extra',
    text: "You're not looking for a full-time income. You simply want to earn extra money without taking on another job, commuting, or changing your daily routine.",
  },
  {
    icon: 'shield',
    title: 'Privacy is the whole point',
    text: "Keeping your identity private isn't just a preference—it's essential. That's exactly why Feetify was built with anonymous selling in mind.",
  },
  {
    icon: 'question',
    title: 'You are just curious',
    text: "You've read the Feetify reviews and want to see if it actually works. Since joining is free, the only thing you're investing is a little of your time.",
  },
  {
    icon: 'chart',
    title: 'You already sell elsewhere',
    text: 'If another platform takes a percentage from every sale, those fees add up quickly. Feetify Premium removes that commission completely, no matter how much you earn.',
  },
  {
    icon: 'clock',
    title: 'Your time comes in gaps',
    text: "Whether it's between classes, during lunch, or after everyone has gone to bed, you can create content whenever you have a spare twenty minutes.",
  },
  {
    icon: 'lock',
    title: 'You got burned before',
    text: "If you've ever sent content and never received payment, you know how frustrating it feels. Verified buyers and protected payments are designed to stop that from happening again.",
  },
]

export const STATS = [
  { value: '500,000+', label: 'Registered members' },
  { value: '2019', label: 'Paying sellers since' },
  { value: '0%', label: 'Commission on Premium' },
  { value: '100%', label: 'Anonymous selling' },
]

export const TESTIMONIALS = [
  'I signed up with a free account because I honestly thought it might be too good to be true. After a couple of months, I realized I was losing more in commission than Premium cost, so upgrading was an easy decision.',
  "I've never shown my face, and I don't plan to. Nobody in my personal life knows I sell here, and that level of privacy is exactly what I was looking for.",
  "The best part is that buyers pay before anything gets delivered. I'd already been scammed on social media twice, so having payment protection made all the difference.",
]

export const FAQS: { question: string; answer: string }[] = [
  {
    question: 'Is Feetify legit?',
    answer:
      "Yes. Feetify has been operating since 2019, with more than 500,000 registered members, secure payments, and thousands of sellers who have successfully been paid. Many review sites agree it's a legitimate platform, although some mention the interface feels a little outdated. What matters most, however, is the active buyer community that helps sellers earn.",
  },
  {
    question: 'Is Feetify safe to sell on?',
    answer:
      "Yes, as long as you keep everything on the platform. Buyers pay before your content unlocks, messages stay inside Feetify, and your profile doesn't display your face, real name, or location. Most problems happen when sellers move conversations to private apps, where those protections disappear.",
  },
  {
    question: 'How do I sell feet pics on Feetify?',
    answer:
      'Create a free account, build an anonymous profile, upload your first set of photos, and set your own prices. Buyers discover your content through search and category filters, then contact you through the platform. Once payment clears, you deliver the content in the same chat. Setup takes less than an hour, and many sellers receive their first message within days.',
  },
  {
    question: 'How does Feetify compare to FeetFinder?',
    answer:
      'Both platforms are dedicated marketplaces for foot content with anonymous profiles and verified buyers. The main difference comes down to pricing. FeetFinder charges a subscription and commission, while Feetify offers free and Premium plans, with Premium removing commission completely. Many sellers use both platforms to see which performs better.',
  },
  {
    question: 'Where can I sell feet pics safely online?',
    answer:
      "Choose a platform where payments and content delivery happen in one place. That way, you never need to share personal information with buyers. Feetify works this way, along with a few other dedicated marketplaces. Social media remains the riskiest option because there's little protection against scams.",
  },
  {
    question: 'How can I sell feet pics without getting scammed?',
    answer:
      "Keep every conversation on the platform. Never send content before payment clears, avoid moving to personal messaging apps, and don't accept payment methods that can easily be reversed. Watermark any preview images. Most scams begin when sellers agree to leave the platform.",
  },
  {
    question: 'How much do feet pics sell for?',
    answer:
      'Your earnings depend more on consistency than your starting prices. Single photos usually cost less, while bundles, videos, and custom requests earn more. Sellers who upload regularly and reply quickly usually earn far more than those who post occasionally.',
  },
  {
    question: 'Can I sell feet pics for free on Feetify?',
    answer:
      'Yes. A free account lets you upload content, message buyers, and receive payments while keeping 80% of every sale. Premium removes the commission entirely, allowing you to keep 100%. Many sellers start with the free plan before deciding whether Premium makes financial sense.',
  },
  {
    question: 'Is it legal to sell feet pics?',
    answer:
      "In many countries, yes. You must be at least 18 years old, sell your own content, follow the platform's rules, and report any required taxes. Feetify verifies every seller's age before allowing them to start. Always check the laws where you live.",
  },
  {
    question: 'How old do you have to be to sell feet pics?',
    answer:
      'You must be at least 18 years old. Every legitimate platform, including Feetify, requires age verification before a seller profile becomes active.',
  },
  {
    question: 'Can guys and men sell feet pics?',
    answer:
      'Absolutely. Men can sell on Feetify just like anyone else, and the male market often has less competition. Build an anonymous profile, upload consistently, use accurate tags, and reply to buyers quickly.',
  },
  {
    question: 'Do I have to show my face to sell feet pics?',
    answer:
      "No. Most sellers never show their face. Your profile doesn't require a face photo, real name, or location, making anonymous selling the normal way to use the platform.",
  },
  {
    question: 'What kind of feet pics sell best?',
    answer:
      'Sharp, well-lit photos with clean backgrounds consistently perform well. Soles, arches, painted toes, heels, socks, and similar styles remain popular. Variety usually matters more than having "perfect" feet.',
  },
  {
    question: 'How do I sell feet pics anonymously?',
    answer:
      "Use a username that isn't connected to your identity, create a separate email address, and check every photo for anything that could reveal who you are. Keep all communication on the platform so your personal information stays private.",
  },
]

export const QUICK_START: { bold: string; text: string }[] = [
  {
    bold: 'Confirm you are 18+.',
    text: 'Age verification is required, and Feetify only supports adult creators, no exceptions.',
  },
  {
    bold: 'Set up a private persona.',
    text: 'Pick a creator name and a fresh email to keep your real identity fully separate.',
  },
  {
    bold: 'Shoot a few photos.',
    text: "Use Feetify's lighting and angle tips to capture clean, appealing feet pics on your phone.",
  },
  {
    bold: 'Create your Feetify profile.',
    text: 'Sign up, verify, and add your secure payout details in minutes.',
  },
  {
    bold: 'Publish and promote.',
    text: 'Set your prices, post your first listing, and start sharing your profile tastefully.',
  },
]

export const CHECKLIST = [
  'No expensive gear needed',
  'No face required',
  'Payments handled for you',
  'Start in one afternoon',
]

export const TIPS: TextCard[] = [
  {
    title: 'Watermark the free stuff',
    text: 'If buyers can view it before paying, add a watermark. It only takes a few seconds and makes it much harder for anyone to save your content without buying it.',
  },
  {
    title: 'Post little and often',
    text: 'Instead of uploading everything at once, spread one photo shoot across a couple of weeks. Active profiles stay visible longer, while inactive ones slowly disappear from search.',
  },
  {
    title: 'Do not haggle',
    text: 'People who argue over the price of one photo rarely become your best customers. Politely decline low offers and focus on buyers who value your work.',
  },
  {
    title: 'Check what is behind you',
    text: 'Look carefully at every photo before uploading. Mirrors, posters, doorways, or personal items in the background can reveal more than you intended.',
  },
  {
    title: 'Reply while they are still there',
    text: "A quick reply gives you a much better chance of making a sale than answering the next day. Many buyers are ready to purchase while they're still browsing.",
  },
  {
    title: 'Say yes to the odd ones',
    text: "Unique requests often pay the most because fewer sellers offer them. If the request is legal and you're comfortable with it, set a fair price and don't undervalue your work.",
  },
]
