import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
  // Sadece yetkili kişilerin bu API'yi tetikleyebildiğinden emin olmak için bir SECRET_TOKEN kullanın.
  // Bu token'ı .env.local dosyanızda tutun ve Vercel'e de ortam değişkeni olarak ekleyin.
  const secret = request.nextUrl.searchParams.get('secret');

  if (secret !== process.env.MY_SECRET_TOKEN) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  // Yeniden doğrulanacak sayfa yolu parametresini alın
  const path = request.nextUrl.searchParams.get('path');

  if (!path) {
    return NextResponse.json({ message: 'Missing path parameter' }, { status: 400 });
  }

  try {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating', error: err }, { status: 500 });
  }
}