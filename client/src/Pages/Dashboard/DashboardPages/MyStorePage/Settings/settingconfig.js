export const settingsConfig = {
    sections: [
      {
        id: 'store-info',
        title: 'Store Information',
        hasInfo: true,
        description: "This is your Store's official link. Share this to your community and on your socials.",
        fields: [
          {
            id: 'store-url',
            type: 'custom-url',
            prefix: 'oneapp.bio/',
            value: 'anandpandey1308',
            readOnly: true,
            hasEdit: true
          }
        ]
      },
      {
        id: 'seo',
        title: 'SEO - Custom Meta',
        hasInfo: true,
        previewCard: {
          image: true,
          text: 'oneapp.bio/anandpandey1308',
          changeButton: true
        },
        fields: [
          {
            id: 'meta-title',
            type: 'text',
            label: 'Meta Title',
            placeholder: 'Enter meta title'
          },
          {
            id: 'meta-description',
            type: 'text',
            label: 'Meta Description',
            placeholder: 'Enter meta description'
          }
        ],
        note: 'Changes to meta may take some time to appear on other platforms.'
      },
      {
        id: 'sensitive-content',
        title: 'Sensitive Content Warning',
        hasInfo: true,
        description: 'Show content warning before your store opens',
        fields: [
          {
            id: 'warning-enabled',
            type: 'switch'
          }
        ]
      },
      {
        id: 'analytics',
        title: 'Analytics Integration',
        hasInfo: true,
        fields: [
          {
            id: 'pixel-id',
            type: 'text',
            label: 'Facebook Tracking',
            subFields: [
              {
                id: 'pixel-id',
                placeholder: 'Pixel ID'
              },
              {
                id: 'conversion-token',
                placeholder: 'Pixel Conversions API Access Token'
              }
            ]
          },
          {
            id: 'google-analytics',
            type: 'text',
            label: 'Google Tracking',
            placeholder: 'Google Analytics ID'
          }
        ]
      }
    ]
  };