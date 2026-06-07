import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components'

interface RequestCompleteEmailProps {
  workspaceName: string
  requestTitle: string
  clientName: string
  dashboardUrl: string
}

export function RequestCompleteEmail({
  workspaceName,
  requestTitle,
  clientName,
  dashboardUrl,
}: RequestCompleteEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>All documents received for "{requestTitle}"</Preview>
      <Body style={{ backgroundColor: '#f9fafb', fontFamily: 'sans-serif' }}>
        <Container style={{ maxWidth: '560px', margin: '40px auto', backgroundColor: '#ffffff', borderRadius: '8px', padding: '40px' }}>
          <Heading style={{ fontSize: '24px', color: '#111827' }}>
            ✓ Request Complete
          </Heading>
          <Text style={{ color: '#374151', fontSize: '16px' }}>
            All required documents have been received from <strong>{clientName}</strong>{' '}
            for request: <em>{requestTitle}</em>
          </Text>
          <Button
            href={dashboardUrl}
            style={{
              backgroundColor: '#6366f1',
              color: '#ffffff',
              padding: '12px 28px',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              textDecoration: 'none',
            }}
          >
            View Request
          </Button>
        </Container>
      </Body>
    </Html>
  )
}
