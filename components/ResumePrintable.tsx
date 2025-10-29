import React from 'react';
import { ResumeData } from '../types';

interface ResumePrintableProps {
  data: ResumeData;
}

const ResumePrintable: React.FC<ResumePrintableProps> = ({ data }) => {
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      fontFamily: "'Times New Roman', Times, serif",
      backgroundColor: '#ffffff',
      color: '#000000',
      padding: '20mm',
      fontSize: '12pt',
      lineHeight: '1.4',
    },
    header: {
      textAlign: 'center',
      borderBottom: '1px solid #000',
      paddingBottom: '10px',
      marginBottom: '10px',
    },
    name: {
      fontSize: '24pt',
      fontWeight: 'bold',
      margin: 0,
    },
    contactInfo: {
      fontSize: '11pt',
      margin: '5px 0 0 0',
    },
    section: {
      marginBottom: '15px',
    },
    sectionTitle: {
      fontSize: '14pt',
      fontWeight: 'bold',
      borderBottom: '1px solid #000',
      paddingBottom: '5px',
      marginBottom: '10px',
      textTransform: 'uppercase',
    },
    job: {
      marginBottom: '10px',
    },
    jobTitle: {
      fontSize: '12pt',
      fontWeight: 'bold',
      display: 'inline-block',
      margin: 0,
    },
    companyPeriod: {
      display: 'flex',
      justifyContent: 'space-between',
      fontStyle: 'italic',
      marginBottom: '5px',
    },
    responsibilities: {
      margin: 0,
      paddingLeft: '20px',
    },
    education: {
        marginBottom: '5px',
    },
    degreeInst: {
        display: 'flex',
        justifyContent: 'space-between',
    },
     skills: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '5px 15px',
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.name}>{data.name}</h1>
        <p style={styles.contactInfo}>
          {data.email} | {data.phone} | {data.linkedin}
        </p>
      </header>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Summary</h2>
        <p>{data.summary}</p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Experience</h2>
        {data.experience.map((exp, index) => (
          <div key={index} style={styles.job}>
            <div style={styles.companyPeriod}>
              <h3 style={styles.jobTitle}>{exp.title}, {exp.company}</h3>
              <span>{exp.period}</span>
            </div>
            <ul style={styles.responsibilities}>
              {exp.responsibilities.map((resp, i) => (
                <li key={i}>{resp}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Education</h2>
        {data.education.map((edu, index) => (
          <div key={index} style={styles.education}>
            <div style={styles.degreeInst}>
                <span style={{fontWeight: 'bold'}}>{edu.degree}, {edu.institution}</span>
                <span>{edu.period}</span>
            </div>
          </div>
        ))}
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Skills</h2>
        <div style={styles.skills}>
            {data.skills.map((skill, index) => (
                <span key={index}>{skill}</span>
            ))}
        </div>
      </section>

      {data.certifications && data.certifications.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Certifications</h2>
          <div style={styles.skills}>
              {data.certifications.map((cert, index) => (
                  <span key={index}>{cert}</span>
              ))}
          </div>
        </section>
      )}

      {data.methodologies && data.methodologies.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Methodologies</h2>
          <div style={styles.skills}>
              {data.methodologies.map((method, index) => (
                  <span key={index}>{method}</span>
              ))}
          </div>
        </section>
      )}

      {data.communityAndWriting && data.communityAndWriting.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Community & Writing</h2>
          <ul style={styles.responsibilities}>
              {data.communityAndWriting.map((item, index) => (
                  <li key={index}>{item}</li>
              ))}
          </ul>
        </section>
      )}

      {data.careerGoals && data.careerGoals.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Career Goals</h2>
          <ul style={styles.responsibilities}>
              {data.careerGoals.map((goal, index) => (
                  <li key={index}>{goal}</li>
              ))}
          </ul>
        </section>
      )}

      {data.preferences && data.preferences.length > 0 && (
        <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Preferences</h2>
            <div style={styles.skills}>
                {data.preferences.map((preference, index) => (
                    <span key={index}>{preference}</span>
                ))}
            </div>
        </section>
      )}
    </div>
  );
};

export default ResumePrintable;