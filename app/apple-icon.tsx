import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #67CDFD 0%, #0088C7 100%)',
          borderRadius: '36px',
        }}
      >
        <div style={{ fontSize: '96px' }}>⏰</div>
      </div>
    ),
    {
      ...size,
    }
  );
}
