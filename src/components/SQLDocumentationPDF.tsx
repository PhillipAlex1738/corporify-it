
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    borderBottom: 1,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    color: '#1a1a1a',
  },
  subHeader: {
    fontSize: 18,
    marginTop: 15,
    marginBottom: 10,
    color: '#2a2a2a',
  },
  description: {
    fontSize: 12,
    marginBottom: 10,
    color: '#4a4a4a',
  },
  code: {
    fontSize: 10,
    fontFamily: 'Courier',
    backgroundColor: '#f5f5f5',
    padding: 10,
    marginBottom: 15,
  }
});

const SQLDocumentationPDF = () => (
  <PDFViewer style={{ width: '100%', height: '100vh' }}>
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>Analytics SQL Documentation</Text>
          
          <Text style={styles.subHeader}>1. Page Views Tracking</Text>
          <Text style={styles.description}>Function to increment page views when a user visits a page:</Text>
          <Text style={styles.code}>
{`-- Function to increment page views
CREATE OR REPLACE FUNCTION public.increment_page_view(page_path text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  page_id UUID;
BEGIN
  -- Create or find the page in analytics_pages
  INSERT INTO public.analytics_pages (path)
  VALUES (page_path)
  ON CONFLICT (path) DO 
    UPDATE SET path = page_path
  RETURNING id INTO page_id;

  -- Log the page view
  INSERT INTO public.analytics_page_views (page_id)
  VALUES (page_id);
END;
$$;`}
          </Text>

          <Text style={styles.subHeader}>2. Total Views Query</Text>
          <Text style={styles.description}>Query to fetch total page views:</Text>
          <Text style={styles.code}>
{`SELECT
  analytics_pages.path,
  COUNT(analytics_page_views.id) as total_views
FROM analytics_pages
LEFT JOIN analytics_page_views ON analytics_page_views.page_id = analytics_pages.id
GROUP BY analytics_pages.path
ORDER BY analytics_pages.path;`}
          </Text>

          <Text style={styles.subHeader}>3. Unique Views Query</Text>
          <Text style={styles.description}>Query to fetch unique page views:</Text>
          <Text style={styles.code}>
{`SELECT
  analytics_pages.path,
  COUNT(DISTINCT analytics_page_views.id) as unique_views
FROM analytics_pages
LEFT JOIN analytics_page_views ON analytics_page_views.page_id = analytics_pages.id
GROUP BY analytics_pages.path
ORDER BY analytics_pages.path;`}
          </Text>

          <Text style={styles.subHeader}>4. Feedback Table Structure</Text>
          <Text style={styles.description}>Table structure for storing user feedback:</Text>
          <Text style={styles.code}>
{`CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  functionality_rating INTEGER NOT NULL,
  ui_rating INTEGER NOT NULL,
  recommendation_rating INTEGER NOT NULL,
  additional_comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);`}
          </Text>
        </View>
      </Page>
    </Document>
  </PDFViewer>
);

export default SQLDocumentationPDF;
