import { Factory } from 'rosie';
import { EnrichmentSignalRow } from '../../firms/types/firm-profile.types';
import { inferProspectFromEnrichment } from './infer-prospect-from-enrichment.function';

const EnrichmentSignalRowFactory = new Factory<EnrichmentSignalRow>()
  .attr('firm_name', 'Cellino Law')
  .attr('tech_stack', 'Litify, Zoom, Microsoft 365')
  .attr('competitor_mentioned', '')
  .attr('recent_news', 'Opened second office in Buffalo')
  .attr('job_postings', 'No current openings')
  .attr('website_monthly_visits', '10000')
  .attr('linkedin_followers', '48708')
  .attr('nps_from_call_notes', '5')
  .attr('last_funding_or_growth_signal', '');

describe('inferProspectFromEnrichment', () => {
  it.each<[string, string]>([
    ['Clio', 'Clio, Google Workspace, Calendly'],
    ['Filevine', 'Filevine, Twilio, Slack'],
    ['Custom CMS', 'Custom CMS, Microsoft 365, RingCentral'],
    ['Litify', 'Litify, Zoom, Microsoft 365'],
  ])(
    'should infer %s as the case management system when tech stack is %s',
    (expectedCaseManagementSystem, techStack) => {
      const row = EnrichmentSignalRowFactory.build({ tech_stack: techStack });

      const result = inferProspectFromEnrichment(row);

      expect(result.case_management_system).toBe(expectedCaseManagementSystem);
    },
  );

  it.each<[string, string]>([
    ['Enterprise', '500000'],
    ['Small', '2500'],
    ['Mid-Market', '10000'],
  ])(
    'should infer %s as the firm size when monthly visits are %s',
    (expectedFirmSize, websiteMonthlyVisits) => {
      const row = EnrichmentSignalRowFactory.build({
        website_monthly_visits: websiteMonthlyVisits,
      });

      const result = inferProspectFromEnrichment(row);

      expect(result.firm_size).toBe(expectedFirmSize);
    },
  );

  it('should derive intake-related pain points when job postings mention intake', () => {
    const row = EnrichmentSignalRowFactory.build({
      job_postings: 'Hiring intake coordinator',
      recent_news: 'Expanded to new office',
    });

    const result = inferProspectFromEnrichment(row);

    expect(result.pain_points).toBe('Intake overflow; After-hours leads');
    expect(result.intake_method).toBe('Call center');
  });

  it('should default pain points to file review time when no hiring signals match', () => {
    const row = EnrichmentSignalRowFactory.build({
      job_postings: 'No current openings',
      recent_news: 'Opened second office',
    });

    const result = inferProspectFromEnrichment(row);

    expect(result.pain_points).toBe('File review time');
    expect(result.intake_method).toBe('Phone + Web Form');
  });

  it('should derive practice area from recent news and growth signals', () => {
    const row = EnrichmentSignalRowFactory.build({
      recent_news: 'Merged with small boutique firm',
      last_funding_or_growth_signal: 'Launched mass tort practice',
    });

    const result = inferProspectFromEnrichment(row);

    expect(result.practice_area).toBe('Mass Tort');
  });

  it('should derive Engaged lead status when NPS is at least 8', () => {
    const row = EnrichmentSignalRowFactory.build({
      nps_from_call_notes: '9',
      competitor_mentioned: 'EvenUp',
    });

    const result = inferProspectFromEnrichment(row);

    expect(result.lead_status).toBe('Engaged');
  });

  it('should derive Nurture lead status when NPS is at most 3', () => {
    const row = EnrichmentSignalRowFactory.build({
      nps_from_call_notes: '3',
      competitor_mentioned: 'EvenUp',
    });

    const result = inferProspectFromEnrichment(row);

    expect(result.lead_status).toBe('Nurture');
  });

  it('should derive New lead status when a competitor is mentioned and NPS is neutral', () => {
    const row = EnrichmentSignalRowFactory.build({
      nps_from_call_notes: '5',
      competitor_mentioned: 'Supio',
    });

    const result = inferProspectFromEnrichment(row);

    expect(result.lead_status).toBe('New');
  });

  it('should preserve the firm name and default industry to Legal Services', () => {
    const row = EnrichmentSignalRowFactory.build({ firm_name: 'Davis Law Group' });

    const result = inferProspectFromEnrichment(row);

    expect(result.firm_name).toBe('Davis Law Group');
    expect(result.industry).toBe('Legal Services');
  });
});
