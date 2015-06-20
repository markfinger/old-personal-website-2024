define([
  'jquery',
  'timelinejs',
  'events'
], function($, timelinejs, events) {

  var timelineConfig = function() {
    createStoryJS({
      type:       'timeline',
      width:      '100%',
      height:     '800',
      source:     {
        "timeline":
        {
          "headline": "A brief history of Sri Lanka",
          "type": "default",
          "text": "Independence, conflicts and pivotal moments in the country once known as Ceylon",
          "startDate": "1945",
          "date": [
            {
              "startDate" : "1948,2,4",
              "endDate" : null,
              "text" : "Ceylon, as Sri Lanka was called then, gains independence from Britain. ",
              "asset" : {
                "media" : "./images/timeline/independence.jpg",
                "credit" : "AFP/Getty Images",
                "caption" : "The ceremonial opening of Sri Lanka's first parliament, on February 10, 1948, six days after independence from Britain."
              },
              "headline" : "Ceylon gains independence"
            },
            {
              "startDate" : "1956,4",
              "endDate" : null,
              "text" : "Solomon Bandaranaike\u2019s populist Sri Lanka Freedom Party wins government after campaigning on a majoritarian Sinhalese Buddhist ticket.  ",
              "asset" : {
                "media" : "./images/timeline/bandaranaike.jpg",
                "credit" : "Paul Popper/Popperfoto/Getty Images",
                "caption" : "Solomon Bandaranaike c. 1956"
              },
              "headline" : "Sri Lanka Freedom Party wins government"
            },
            {
              "startDate" : "1956,6",
              "endDate" : null,
              "text" : "The controversial Sinhala Only Act is passed. It denies official recognition to the Tamil language, spoken at the time by around 25 per cent of the island\u2019s population.",
              "asset" : {
                "media" : null,
                "credit" : null,
                "caption" : null
              },
              "headline" : "Sinhala Only Act passes"
            },
            {
              "startDate" : "1958,5,24",
              "endDate" : "1958,5,27",
              "text" : "Race riots between Sinhalese and Tamils leave 300 people dead.",
              "asset" : {
                "media" : null,
                "credit" : null,
                "caption" : null
              },
              "headline" : "Race riots leave hundreds dead"
            },
            {
              "startDate" : "1970",
              "endDate" : null,
              "text" : "The importation of Tamil-language literature is banned by the government.",
              "asset" : {
                "media" : null,
                "credit" : null,
                "caption" : null
              },
              "headline" : "Tamil-language literature ban"
            },
            {
              "startDate" : "1971",
              "endDate" : null,
              "text" : " An official \u2018Standardisation\u2019 education quota policy is introduced, which limits Tamil access to universities. A Marxist rebellion begins among the southern Sinhalese community.",
              "asset" : {
                "media" : null,
                "credit" : null,
                "caption" : null
              },
              "headline" : "Quota limits Tamil education"
            },
            {
              "startDate" : "1972,5,22",
              "endDate" : null,
              "text" : "Ceylon becomes a republic and is renamed Sri Lanka ",
              "asset" : {
                "media" : null,
                "credit" : null,
                "caption" : null
              },
              "headline" : "Ceylon becomes Sri Lanka"
            },
            {
              "startDate" : "1975,7,27",
              "endDate" : null,
              "text" : "The pro-Colombo mayor of the northern city of Jaffna, Alfred Duraiappah, is assassinated by Tamil militia member Velupillai Prabhakaran.",
              "asset" : {
                "media" : null,
                "credit" : null,
                "caption" : null
              },
              "headline" : "Jaffna mayor assassinated"
            },
            {
              "startDate" : "1976,5,5",
              "endDate" : null,
              "text" : "The separatist militia, Liberation Tigers of Tamil Eelam (LTTE), or Tamil Tigers, is formed and demands a separate state in the mostly Tamil north-east. It calls this zone Eelam, evoking the ancient Tamil name for the island. Prabhakaran is the LTTE\u2019s military commander.",
              "asset" : {
                "media" : "./images/timeline/ltte-commader.jpg",
                "credit" : "STR/AFP/Getty Images",
                "caption" : "Tigers supremo Velupillai Prabhakaran is pictured here next to the LTTE flag, in late 2003."
              },
              "headline" : "Tamil Tigers separatist militia forms"
            },
            {
              "startDate" : "1981,5,31",
              "endDate" : "1981,6,1",
              "text" : "The historic Jaffna library is razed in a fire set by a Sinhalese mob after Sinhalese police were killed at a pro-Tamil rally.",
              "asset" : {
                "media" : "./images/timeline/library.jpg",
                "credit" : "Luis Ascui/Getty Images",
                "caption" : "A security guard patrols outside the Jaffna library in 2003,  before it was re-opened to the public later that year."
              },
              "headline" : "Mob burns Jaffna library"
            },
            {
              "startDate" : "1983,7,23",
              "endDate" : null,
              "text" : "LTTE rebels kill 13 government soldiers in an ambush. The island-wide \u2018Black July\u2019 anti-Tamil attacks follow \u2013 a pogrom that leaves some 3,000 people dead and forces hundreds of thousands of Tamils to flee abroad. The Sri Lankan civil war begins.",
              "asset" : {
                "media" : "./images/timeline/ruined-aircraft.jpg",
                "credit" : "MILITARY PHOTO/AFP/Getty Images",
                "caption" : "The civil war would last until May 2009. This 1995 photo shows Sri Lankan soldiers checking the remains of an aircraft captured from Tamil Tigers guerrillas in the town of Neerveli in the northern Jaffna peninsula."
              },
              "headline" : "Rebel ambush sparks civil war"
            },
            {
              "startDate" : "1987,7,29",
              "endDate" : "1990,3,24",
              "text" : "India signs the Indo-Sri Lanka Peace Accord with Sri Lanka, after which Indian troops begin \u2018peace-keeping\u2019 operations in the north-east; these quickly descend into a war against the LTTE that rages until 1990, when India withdraws.",
              "asset" : {
                "media" : "./images/timeline/indian-troops.jpg",
                "credit" : "DOUGLAS E. CURRAN/AFP/Getty Images",
                "caption" : "A convoy of Indian troops moves towards Jaffna from Elephant Pass in October 1987."
              },
              "headline" : "Indian 'peace keeping' begins - creating another war "
            },
            {
              "startDate" : "11/14/1987",
              "endDate" : null,
              "text" : "The 13th Amendment to the Sri Lankan constitution enshrines Tamil as an official language. The Marxist-Leninist People\u2019s Liberation Front begins another insurrection in the Sinhalese south, starting a civil war within a civil war.",
              "asset" : {
                "media" : null,
                "credit" : null,
                "caption" : null
              },
              "headline" : "Tamil becomes an official language"
            },
            {
              "startDate" : "1991,5,21",
              "endDate" : "1991,5,21",
              "text" : "Indian Prime Minister Rajiv Gandhi is assassinated by an LTTE suicide bomber in Chennai, in revenge for India\u2019s incursion into the Sri Lankan conflict.",
              "asset" : {
                "media" : "./images/timeline/gandhi-funeral.jpg",
                "credit" : "DOUGLAS E. CURRAN/AFP/Getty Images",
                "caption" : " The funeral procession for assassinated former Indian Prime Minister Rajiv Gandhi, in New Delhi on May 24, 1991."
              },
              "headline" : "Tiger assassinates Indian PM Gandhi"
            },
            {
              "startDate" : "05/01/1993",
              "endDate" : null,
              "text" : "Sri Lankan President Ranasinghe Premadasa is assassinated by an LTTE suicide bomber in Colombo.",
              "asset" : {
                "media" : "./images/timeline/premadasa-funeral.jpg",
                "credit" : "DOUGLAS E. CURRAN/AFP/Getty Images",
                "caption" : "A soldier watches the funeral procession of Sri Lankan President Ranasinghe Premadasa  in Colombo, May 6, 1993."
              },
              "headline" : "Tiger assassinates Sri Lankan President"
            },
            {
              "startDate" : "1995,12,5",
              "endDate" : null,
              "text" : "The Tamil \u2018capital\u2019 Jaffna falls to government forces. The LTTE retreats south to secure the Vanni region, eventually setting up its Eelam \u2018capital\u2019 in the town of Kilinochchi.",
              "asset" : {
                "media" : null,
                "credit" : null,
                "caption" : null
              },
              "headline" : "Tamil capital falls to government forces"
            },
            {
              "startDate" : "2001,11,10",
              "endDate" : null,
              "text" : "John Howard\u2019s Liberal Government wins the Australian federal election promising a \u201cPacific Solution\u201d to stop asylum seekers coming to Australia by boat from neighbouring countries, including Sri Lanka.",
              "asset" : {
                "media" : "./images/timeline/howard.jpg",
                "credit" : "Nick Laham/Getty Images",
                "caption" : "John Howard celebrates victory with his family, after his election win, November 10, 2001"
              },
              "headline" : "Australia re-elects Howard government"
            },
            {
              "startDate" : "2001",
              "endDate" : "2002",
              "text" : "As part of a Norwegian-sponsored peace process, a ceasefire is negotiated between Colombo and the LTTE. The Tigers drop demands for a separate Tamil state and the two sides pursue federalist discussions.",
              "asset" : {
                "media" : "./images/timeline/signing-ceasefire.jpg",
                "credit" : "STR/AFP/Getty Images",
                "caption" : "Tamil Tiger leader Velupillai Prabhakaran signs a historic ceasefire agreement in 2002, to clear the way for Norwegian-brokered peace talks with the Colombo government."
              },
              "headline" : "Ceasefire negotiated in Sri Lanka"
            },
            {
              "startDate" : "2004,3",
              "endDate" : null,
              "text" : "The LTTE\u2019s eastern commander Colonel Karuna splits the Tigers by breaking with the movement's northern leadership, renouncing terrorism and siding with the Colombo government.",
              "asset" : {
                "media" : "./images/timeline/beach-lanterns.jpg",
                "credit" : "PRAKASH SINGH/AFP/Getty Images",
                "caption" : null
              },
              "headline" : "LTTE split"
            },
            {
              "startDate" : "2004,12,26",
              "endDate" : null,
              "text" : "The Boxing Day tsunami devastates the island, killing 35,000 people and making 2.5 million people homeless. Disputes over relief efforts simmer between the Tigers and the government, as Colombo gains access to aid-starved Eelam. But in June 2005, the Sri Lankan high court blocks an agreement to allow sharing of tsunami aid with the LTTE.",
              "asset" : {
                "media" : "./images/timeline/tsunami-debris.jpg",
                "credit" : "JIMIN LAI/AFP/Getty Images",
                "caption" : "A house stands amid debris from tsunamis in the Galle district of Sri Lanka, December 27, 2004."
              },
              "headline" : "Boxing Day tsunami kills 35,000 people"
            },
            {
              "startDate" : "2005,11,17",
              "endDate" : null,
              "text" : "Mahinda Rajapaksa campaigns for the presidency on a tough anti-LTTE ticket. The Tigers boycott the poll, effectively handing power to Rajapaksa. Scandinavian peace monitors report thousands of treaty violations by both sides during the ceasefire period.",
              "asset" : {
                "media" : null,
                "credit" : null,
                "caption" : null
              },
              "headline" : "Mahinda Rajapaksa wins presidency"
            },
            {
              "startDate" : "2006,10",
              "endDate" : null,
              "text" : "Peace talks resume, then swiftly collapse as the LTTE withdraws. Hostilities resume.",
              "asset" : {
                "media" : null,
                "credit" : null,
                "caption" : null
              },
              "headline" : "Peace talks resume, then collapse"
            },
            {
              "startDate" : "2008,1",
              "endDate" : null,
              "text" : "The ceasefire is unilaterally terminated by the Rajapaksa government. The civil war resumes, with renewed vigour on the part of the China-backed government which progressively takes critical LTTE strongholds.",
              "asset" : {
                "media" : null,
                "credit" : null,
                "caption" : null
              },
              "headline" : "Civil war resumes"
            },
            {
              "startDate" : "2009,5,18",
              "endDate" : null,
              "text" : "Prabhakaran and senior Tigers are killed in battle by government forces, bringing the war to an end. Colombo takes full control of the island for the first time in 26 years.",
              "asset" : {
                "media" : null,
                "credit" : null,
                "caption" : null
              },
              "headline" : "Tiger leadership killed, ending the war"
            },
            {
              "startDate" : "2009",
              "endDate" : "2010",
              "text" : " As many as 500,000 refugees are corralled, screened and \u2018de-Tigerised\u2019 in  government-controlled camps in the north.",
              "asset" : {
                "media" : "./images/timeline/tamil-students.jpg",
                "credit" : "LAKRUWAN WANNIARACHCHI/AFP/Getty Images",
                "caption" : "Sri Lankan soldiers keep watch as Tamil students study at a camp for war-displaced Tamils in Vavuniya on February 23, 2009."
              },
              "headline" : "Some 500,000 refugees corralled in government-controlled camps"
            },
            {
              "startDate" : "2010,1,27",
              "endDate" : null,
              "text" : "Amid international allegations of war crimes, Rajapaksa is re-elected President in a landslide victory.",
              "asset" : {
                "media" : "./images/timeline/rajapaksa.jpg",
                "credit" : "LAKRUWAN WANNIARACHCHI/AFP/Getty Images",
                "caption" : "President Rajapakse addresses the nation during Independence Day celebrations in February 2010."
              },
              "headline" : "Rajapaksa wins easily"
            },
            {
              "startDate" : "2013,1,11",
              "endDate" : null,
              "text" : " The Rajapaksa-controlled Parliament impeaches Chief Justice Shirani Bandaranayake on 14 charges of financial and official misconduct, which the Opposition claims are politically motivated. She is dismissed and replaced by the government's senior legal adviser, Mohan Peiris. ",
              "asset" : {
                "media" : null,
                "credit" : null,
                "caption" : null
              },
              "headline" : "Chief Justice impeached"
            },
            {
              "startDate" : "2013,3,21",
              "endDate" : null,
              "text" : "The United Nations Human Rights Council passes a highly critical resolution urging Sri Lanka to conduct an \"independent and credible investigation\" into alleged war crimes during the Tamil Tiger insurgency.",
              "asset" : {
                "media" : "./images/timeline/un-protest.jpg",
                "credit" : "Ishara S.KODIKARA/AFP/Getty Images",
                "caption" : "Sri Lankan demonstrators hold portraits of missing relatives during a protest outside the United Nations office in Colombo on March 13, 2013."
              },
              "headline" : "UNHCR urges war crimes inquiry"
            },
            {
              "startDate" : "2013,4",
              "endDate" : null,
              "text" : "Amnesty International accuses Sri Lanka of intensifying a crackdown on dissent, and urges Commonwealth leaders not to hold Head of Government Meeting (CHOGM) there unless the human rights situation is improved. Sri Lanka rejects the allegations, claiming that a rehabilitation process is underway.",
              "asset" : {
                "media" : null,
                "credit" : null,
                "caption" : null
              },
              "headline" : "Amnesty International urges CHOGM change"
            },
            {
              "startDate" : "2013,9,21",
              "endDate" : "2013,9,21",
              "text" : "The first post-war provincial elections in the country's mostly Tamil northern province are set for September 21, four years after the end of the civil war. ",
              "asset" : {
                "media" : null,
                "credit" : null,
                "caption" : null
              },
              "headline" : "First post-war provincial elections"
            },
            {
              "startDate" : "2013,11,15",
              "endDate" : "2013,11,17",
              "text" : "Though Canada has already declared it will not attend the CHOGM summit, citing Sri Lanka\u2019s poor human rights record, Australia and Britain have plans to attend.",
              "asset" : {
                "media" : null,
                "credit" : null,
                "caption" : null
              },
              "headline" : "Australia plans to attend CHOGM in Colombo"
            }
          ]
        }
      },
      embed_id:   'timeline',
      font:       './styles/timeline/MetaFont.css',
      css:        './styles/timeline/timeline.css',
      js:         './bower_components/timelinejs/compiled/js/timeline.js'
    });
  };

  var init = function() {
    events.once('loading:complete', function () {
      if ($('#timeline').length) {
        timelineConfig();
      }
    });
  };

  return {
    init: init
  };
});