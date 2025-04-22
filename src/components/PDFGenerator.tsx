
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
  }
});

type PDFGeneratorProps = {
  content: string;
  title?: string;
};

// Create Document Component
const PDFGenerator = ({ content, title = "Corporified Text" }: PDFGeneratorProps) => (
  <PDFViewer style={{ width: '100%', height: '500px' }}>
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>{title}</Text>
          <Text style={styles.text}>{content}</Text>
        </View>
      </Page>
    </Document>
  </PDFViewer>
);

export default PDFGenerator;
