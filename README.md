This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Admin Panel Additions

### Content Management for Android App

Admins can now upload an image along with accompanying text. Uploaded entries are stored in the `contents` Firestore collection and the image files land in Firebase Storage. An Android application can query this collection to display the latest content to users.

### User Activity Metrics

- **Total users**: counted from documents in the `users` collection.
- **Active users**: calculated by checking the `isActive` flag on each user document. On every successful login the panel sets this flag and updates a `lastActive` timestamp.

### Firestore structure reminder

- `users` collection with fields: `name`, `email`, `role`, `isActive`, `lastActive` (timestamp).
- `contents` collection with fields: `text`, `imageUrl`, `createdAt`.

Make sure your Firebase rules allow authenticated admins to read/write these collections and upload to storage.

### Android App Example

On the Android side you can use the Firebase SDK to listen for new documents in `contents` and display them. Here's a simplified Kotlin example:

```kotlin
val db = FirebaseFirestore.getInstance()
db.collection("contents")
    .orderBy("createdAt", Query.Direction.DESCENDING)
    .addSnapshotListener { snapshots, e ->
        if (e != null) return@addSnapshotListener
        val items = snapshots?.documents?.mapNotNull { doc ->
            val text = doc.getString("text")
            val imageUrl = doc.getString("imageUrl")
            if (text != null && imageUrl != null) {
                ContentItem(text, imageUrl)
            } else null
        } ?: emptyList()
        // update your UI with items
    }
```

Replace `ContentItem` with your own data class and handle image loading with Glide/Picasso.
