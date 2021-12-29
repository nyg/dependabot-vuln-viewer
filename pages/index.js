import { useState } from 'react'
import Input from '../components/input'
import Layout from '../components/layout'
import Repo from '../components/repo'


export default function Home() {

  const [repos, setRepos] = useState([])
  const [stats, setStats] = useState({})

  const retrieveVulnerabilities = event => {

    event.preventDefault()

    const body = new URLSearchParams(new FormData(event.target))
    fetch('/api/vulnerabilities', { method: 'POST', body })
      .then(response => response.json())
      .then(json => {
        setRepos(json.repos)
        setStats(json.stats)
      })
  }

  return (
    <Layout name='Viewer'>
      <form method='post' onSubmit={retrieveVulnerabilities}>
        <div className='grid grid-cols-3 gap-2'>
          <Input name='githubApiUrl' label='Github API URL' defaultValue='https://api.github.com/graphql' />
          <Input name='githubApiToken' label='Github API Token' defaultValue={process.env.NEXT_PUBLIC_API_TOKEN} type='password' />

          <div className='grid grid-cols-2 gap-2'>
            <Input name='reposPerReq' label='Repos fetched / req' defaultValue={50} />
            <Input name='vulnsPerReq' label='Vulns fetched / req' defaultValue={15} />
          </div>

          <Input name='repositories' label='Repositories' defaultValue={process.env.NEXT_PUBLIC_REPOS} className='col-span-full' >
            <button className='px-3 m-1 bg-gray-600 text-gray-100 rounded hover:bg-gray-500'>Search</button>
          </Input>
        </div>
      </form>
      {Object.keys(stats).length > 0 && (
        <p className='pl-3'>
          Searched {stats.fetchedRepoCount} of {stats.totalRepoCount} repositories, found {stats.vulnCount} vulnerabilities in {stats.vulnRepoCount} of them.{' '}
          {stats.hasMoreRepos && (
            <a href=''>Load more…</a>
          )}
        </p>
      )}
      <div className='space-y-8'>
        {/* {[
  {
    id: 'R_kgDOGSN0wA',
    owner: { login: 'nyg' },
    name: 'heig',
    url: 'https://github.com/nyg/heig',
    alerts: {
      totalCount: 68,
      nodes: [
        {
          id: 'RVA_kwDOGSN0wM5Yy8Ap',
          advisory: {
            summary: 'TemporaryFolder on unix-like systems does not limit access to created files',
            description: '### Vulnerability\n' +
              '\n' +
              'The JUnit4 test rule [TemporaryFolder](https://junit.org/junit4/javadoc/4.13/org/junit/rules/TemporaryFolder.html) contains a local information disclosure vulnerability.\n' +
              '\n' +
              'Example of vulnerable code:\n' +
              '```java\n' +
              'public static class HasTempFolder {\n' +
              '    @Rule\n' +
              '    public TemporaryFolder folder = new TemporaryFolder();\n' +
              '\n' +
              '    @Test\n' +
              '    public void testUsingTempFolder() throws IOException {\n' +
              '        folder.getRoot(); // Previous file permissions: `drwxr-xr-x`; After fix:`drwx------`\n' +
              '        File createdFile= folder.newFile("myfile.txt"); // unchanged/irrelevant file permissions\n' +
              '        File createdFolder= folder.newFolder("subfolder"); // unchanged/irrelevant file permissions\n' +
              '        // ...\n' +
              '    }\n' +
              '}\n' +
              '```\n' +
              '\n' +
              '### Impact\n' +
              '\n' +
              "On Unix like systems, the system's temporary directory is shared between all users on that system. Because of this, when files and directories are written into this directory they are, by default, readable by other users on that same system.\n" +
              '\n' +
              'This vulnerability **does not** allow other users to overwrite the contents of these directories or files. This is purely an information disclosure vulnerability.\n' +
              '\n' +
              'When analyzing the impact of this vulnerability, here are the important questions to ask:\n' +
              '\n' +
              '1. Do the JUnit tests write sensitive information, like API keys or passwords, into the temporary folder?\n' +
              "    - If yes, this vulnerability impacts you, but only if you also answer 'yes' to question 2.\n" +
              '    - If no, this vulnerability does not impact you.\n' +
              '2. Do the JUnit tests ever execute in an environment where the OS has other untrusted users. \n' +
              "    _This may apply in CI/CD environments but normally won't be 'yes' for personal developer machines._\n" +
              "    - If yes, and you answered 'yes' to question 1, this vulnerability impacts you.\n" +
              '    - If no, this vulnerability does not impact you.\n' +
              '\n' +
              '### Patches\n' +
              '\n' +
              'Because certain JDK file system APIs were only added in JDK 1.7, this this fix is dependent upon the version of the JDK you are using.\n' +
              ' - Java 1.7 and higher users: this vulnerability is fixed in 4.13.1.\n' +
              ' - Java 1.6 and lower users: **no patch is available, you must use the workaround below.**\n' +
              '\n' +
              '### Workarounds\n' +
              '\n' +
              'If you are unable to patch, or are stuck running on Java 1.6, specifying the `java.io.tmpdir` system environment variable to a directory that is exclusively owned by the executing user will fix this vulnerability.\n' +
              '\n' +
              '### References\n' +
              '- [CWE-200: Exposure of Sensitive Information to an Unauthorized Actor](https://cwe.mitre.org/data/definitions/200.html)\n' +
              '- Fix commit https://github.com/junit-team/junit4/commit/610155b8c22138329f0723eec22521627dbc52ae\n' +
              '\n' +
              '#### Similar Vulnerabilities\n' +
              ' - Google Guava - https://github.com/google/guava/issues/4011\n' +
              ' - Apache Ant - https://nvd.nist.gov/vuln/detail/CVE-2020-1945\n' +
              ' - JetBrains Kotlin Compiler - https://nvd.nist.gov/vuln/detail/CVE-2020-15824\n' +
              '\n' +
              '### For more information\n' +
              'If you have any questions or comments about this advisory, please pen an issue in [junit-team/junit4](https://github.com/junit-team/junit4/issues).',
            permalink: 'https://github.com/advisories/GHSA-269g-pwp5-87pp',
            identifiers: [
              { type: 'GHSA', value: 'GHSA-269g-pwp5-87pp' },
              { type: 'CVE', value: 'CVE-2020-15250' }
            ],
            cvss: {
              score: 4.4,
              vectorString: 'CVSS:3.1/AV:L/AC:H/PR:L/UI:R/S:U/C:H/I:N/A:N'
            }
          },
          vuln: {
            severity: 'MODERATE',
            package: { name: 'junit:junit' },
            vulnerableVersionRange: '>= 4.7, < 4.13.1',
            firstPatchedVersion: { identifier: '4.13.1' }
          }
        },
        {
          id: 'RVA_kwDOGSN0wM5Yy8Ax',
          advisory: {
            summary: 'Validation Bypass in kind-of',
            description: 'Versions of `kind-of` 6.x prior to 6.0.3 are vulnerable to a Validation Bypass. A maliciously crafted object can alter the result of the type check, allowing attackers to bypass the type checking validation. \n' +
              '\n' +
              '\n' +
              '## Recommendation\n' +
              '\n' +
              'Upgrade to versions 6.0.3 or later.',
            permalink: 'https://github.com/advisories/GHSA-6c8f-qphg-qjgp',
            identifiers: [
              { type: 'GHSA', value: 'GHSA-6c8f-qphg-qjgp' },
              { type: 'CVE', value: 'CVE-2019-20149' }
            ],
            cvss: {
              score: 7.5,
              vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:H/A:N'
            }
          },
          vuln: {
            severity: 'HIGH',
            package: { name: 'kind-of' },
            vulnerableVersionRange: '>= 6.0.0, < 6.0.3',
            firstPatchedVersion: { identifier: '6.0.3' }
          }
        },
        {
          id: 'RVA_kwDOGSN0wM5Yy8A6',
          advisory: {
            summary: 'Prototype Pollution in minimist',
            description: 'Affected versions of `minimist` are vulnerable to prototype pollution. Arguments are not properly sanitized, allowing an attacker to modify the prototype of `Object`, causing the addition or modification of an existing property that will exist on all objects.  \n' +
              'Parsing the argument `--__proto__.y=Polluted` adds a `y` property with value `Polluted` to all objects. The argument `--__proto__=Polluted` raises and uncaught error and crashes the application.  \n' +
              'This is exploitable if attackers have control over the arguments being passed to `minimist`.\n' +
              '\n' +
              '\n' +
              '\n' +
              '## Recommendation\n' +
              '\n' +
              'Upgrade to versions 0.2.1, 1.2.3 or later.',
            permalink: 'https://github.com/advisories/GHSA-vh95-rmgr-6w4m',
            identifiers: [
              { type: 'GHSA', value: 'GHSA-vh95-rmgr-6w4m' },
              { type: 'CVE', value: 'CVE-2020-7598' }
            ],
            cvss: {
              score: 5.6,
              vectorString: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:L/I:L/A:L'
            }
          },
          vuln: {
            severity: 'MODERATE',
            package: { name: 'minimist' },
            vulnerableVersionRange: '>= 1.0.0, < 1.2.3',
            firstPatchedVersion: { identifier: '1.2.3' }
          }
        }
      ]
    }
  },
  {
    id: 'MDEwOlJlcG9zaXRvcnkyMjQyODk0Njk=',
    owner: { login: 'nyg' },
    name: 'root-me-team-tracker',
    url: 'https://github.com/nyg/root-me-team-tracker',
    alerts: {
      totalCount: 9,
      nodes: [
        {
          id: 'MDI4OlJlcG9zaXRvcnlWdWxuZXJhYmlsaXR5QWxlcnQyNjMxMjg0NDk=',
          advisory: {
            summary: 'Prototype Pollution in minimist',
            description: 'Affected versions of `minimist` are vulnerable to prototype pollution. Arguments are not properly sanitized, allowing an attacker to modify the prototype of `Object`, causing the addition or modification of an existing property that will exist on all objects.  \n' +
              'Parsing the argument `--__proto__.y=Polluted` adds a `y` property with value `Polluted` to all objects. The argument `--__proto__=Polluted` raises and uncaught error and crashes the application.  \n' +
              'This is exploitable if attackers have control over the arguments being passed to `minimist`.\n' +
              '\n' +
              '\n' +
              '\n' +
              '## Recommendation\n' +
              '\n' +
              'Upgrade to versions 0.2.1, 1.2.3 or later.',
            permalink: 'https://github.com/advisories/GHSA-vh95-rmgr-6w4m',
            identifiers: [
              { type: 'GHSA', value: 'GHSA-vh95-rmgr-6w4m' },
              { type: 'CVE', value: 'CVE-2020-7598' }
            ],
            cvss: {
              score: 5.6,
              vectorString: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:L/I:L/A:L'
            }
          },
          vuln: {
            severity: 'MODERATE',
            package: { name: 'minimist' },
            vulnerableVersionRange: '>= 1.0.0, < 1.2.3',
            firstPatchedVersion: { identifier: '1.2.3' }
          }
        },
        {
          id: 'MDI4OlJlcG9zaXRvcnlWdWxuZXJhYmlsaXR5QWxlcnQ2Mjc4Njg0MjI=',
          advisory: {
            summary: 'Command Injection in lodash',
            description: '`lodash` versions prior to 4.17.21 are vulnerable to Command Injection via the template function.',
            permalink: 'https://github.com/advisories/GHSA-35jh-r3h4-6jhm',
            identifiers: [
              { type: 'GHSA', value: 'GHSA-35jh-r3h4-6jhm' },
              { type: 'CVE', value: 'CVE-2021-23337' }
            ],
            cvss: {
              score: 7.2,
              vectorString: 'CVSS:3.1/AV:N/AC:L/PR:H/UI:N/S:U/C:H/I:H/A:H'
            }
          },
          vuln: {
            severity: 'HIGH',
            package: { name: 'lodash' },
            vulnerableVersionRange: '< 4.17.21',
            firstPatchedVersion: { identifier: '4.17.21' }
          }
        },
        {
          id: 'MDI4OlJlcG9zaXRvcnlWdWxuZXJhYmlsaXR5QWxlcnQ4MTA4MTE0OTM=',
          advisory: {
            summary: 'Arbitrary File Creation/Overwrite via insufficient symlink protection due to directory cache poisoning',
            description: '### Impact\n' +
              '\n' +
              'Arbitrary File Creation, Arbitrary File Overwrite, Arbitrary Code Execution\n' +
              '\n' +
              '`node-tar` aims to guarantee that any file whose location would be modified by a symbolic link is not extracted. This is, in part, achieved by ensuring that extracted directories are not symlinks.  Additionally, in order to prevent unnecessary `stat` calls to determine whether a given path is a directory, paths are cached when directories are created.\n' +
              '\n' +
              'This logic was insufficient when extracting tar files that contained both a directory and a symlink with the same name as the directory. This order of operations resulted in the directory being created and added to the `node-tar` directory cache. When a directory is present in the directory cache, subsequent calls to mkdir for that directory are skipped. However, this is also where `node-tar` checks for symlinks occur.\n' +
              '\n' +
              'By first creating a directory, and then replacing that directory with a symlink, it was thus possible to bypass `node-tar` symlink checks on directories, essentially allowing an untrusted tar file to symlink into an arbitrary location and subsequently extracting arbitrary files into that location, thus allowing arbitrary file creation and overwrite.\n' +
              '\n' +
              'This issue was addressed in releases 3.2.3, 4.4.15, 5.0.7 and 6.1.2.\n' +
              '\n' +
              '### Patches\n' +
              '\n' +
              '3.2.3 || 4.4.15 || 5.0.7 || 6.1.2\n' +
              '\n' +
              '### Workarounds\n' +
              '\n' +
              'Users may work around this vulnerability without upgrading by creating a custom `filter` method which prevents the extraction of symbolic links.\n' +
              '\n' +
              '```js\n' +
              "const tar = require('tar')\n" +
              '\n' +
              'tar.x({\n' +
              "  file: 'archive.tgz',\n" +
              '  filter: (file, entry) => {\n' +
              "    if (entry.type === 'SymbolicLink') {\n" +
              '      return false\n' +
              '    } else {\n' +
              '      return true\n' +
              '    }\n' +
              '  }\n' +
              '})\n' +
              '```\n' +
              '\n' +
              'Users are encouraged to upgrade to the latest patch versions, rather than attempt to sanitize tar input themselves.',
            permalink: 'https://github.com/advisories/GHSA-r628-mhmh-qjhw',
            identifiers: [
              { type: 'GHSA', value: 'GHSA-r628-mhmh-qjhw' },
              { type: 'CVE', value: 'CVE-2021-32803' }
            ],
            cvss: {
              score: 8.2,
              vectorString: 'CVSS:3.1/AV:L/AC:L/PR:N/UI:R/S:C/C:H/I:H/A:N'
            }
          },
          vuln: {
            severity: 'HIGH',
            package: { name: 'tar' },
            vulnerableVersionRange: '>= 4.0.0, < 4.4.15',
            firstPatchedVersion: { identifier: '4.4.15' }
          }
        }
      ]
    }
  },
  {
    id: 'MDEwOlJlcG9zaXRvcnkxMjQ1NzA2Mzg=',
    owner: { login: 'nyg' },
    name: 'wiktionary-to-kindle',
    url: 'https://github.com/nyg/wiktionary-to-kindle',
    alerts: {
      totalCount: 4,
      nodes: [
        {
          id: 'MDI4OlJlcG9zaXRvcnlWdWxuZXJhYmlsaXR5QWxlcnQ4MDM1OTIzMzc=',
          advisory: {
            summary: 'Improper Handling of Length Parameter Inconsistency in Compress',
            description: "When reading a specially crafted TAR archive, Compress can be made to allocate large amounts of memory that finally leads to an out of memory error even for very small inputs. This could be used to mount a denial of service attack against services that use Compress' tar package.",
            permalink: 'https://github.com/advisories/GHSA-xqfj-vm6h-2x34',
            identifiers: [
              { type: 'GHSA', value: 'GHSA-xqfj-vm6h-2x34' },
              { type: 'CVE', value: 'CVE-2021-35517' }
            ],
            cvss: {
              score: 7.5,
              vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H'
            }
          },
          vuln: {
            severity: 'HIGH',
            package: { name: 'org.apache.commons:commons-compress' },
            vulnerableVersionRange: '< 1.21',
            firstPatchedVersion: { identifier: '1.21' }
          }
        },
        {
          id: 'MDI4OlJlcG9zaXRvcnlWdWxuZXJhYmlsaXR5QWxlcnQ4MDM1OTMxMzE=',
          advisory: {
            summary: 'Excessive Iteration in Compress',
            description: "When reading a specially crafted 7Z archive, the construction of the list of codecs that decompress an entry can result in an infinite loop. This could be used to mount a denial of service attack against services that use Compress' sevenz package.",
            permalink: 'https://github.com/advisories/GHSA-7hfm-57qf-j43q',
            identifiers: [
              { type: 'GHSA', value: 'GHSA-7hfm-57qf-j43q' },
              { type: 'CVE', value: 'CVE-2021-35515' }
            ],
            cvss: {
              score: 7.5,
              vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H'
            }
          },
          vuln: {
            severity: 'HIGH',
            package: { name: 'org.apache.commons:commons-compress' },
            vulnerableVersionRange: '< 1.21',
            firstPatchedVersion: { identifier: '1.21' }
          }
        },
        {
          id: 'MDI4OlJlcG9zaXRvcnlWdWxuZXJhYmlsaXR5QWxlcnQ4MDM1OTMzMTg=',
          advisory: {
            summary: 'Improper Handling of Length Parameter Inconsistency in Compress',
            description: "When reading a specially crafted 7Z archive, Compress can be made to allocate large amounts of memory that finally leads to an out of memory error even for very small inputs. This could be used to mount a denial of service attack against services that use Compress' sevenz package.",
            permalink: 'https://github.com/advisories/GHSA-crv7-7245-f45f',
            identifiers: [
              { type: 'GHSA', value: 'GHSA-crv7-7245-f45f' },
              { type: 'CVE', value: 'CVE-2021-35516' }
            ],
            cvss: {
              score: 7.5,
              vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H'
            }
          },
          vuln: {
            severity: 'HIGH',
            package: { name: 'org.apache.commons:commons-compress' },
            vulnerableVersionRange: '< 1.21',
            firstPatchedVersion: { identifier: '1.21' }
          }
        }
      ]
    }
  },
  {
    id: 'MDEwOlJlcG9zaXRvcnk3ODc1OTExMQ==',
    owner: { login: 'nyg' },
    name: 'twitter-followers-evolution',
    url: 'https://github.com/nyg/twitter-followers-evolution',
    alerts: {
      totalCount: 4,
      nodes: [
        {
          id: 'MDI4OlJlcG9zaXRvcnlWdWxuZXJhYmlsaXR5QWxlcnQ1ODM0Njk3NTE=',
          advisory: {
            summary: 'Stored cross-site scripting in Grid component in Vaadin 7 and 8',
            description: 'Missing variable sanitization in `Grid` component in `com.vaadin:vaadin-server` versions 7.4.0 through 7.7.19 (Vaadin 7.4.0 through 7.7.19), and 8.0.0 through 8.8.4 (Vaadin 8.0.0 through 8.8.4) allows attacker to inject malicious JavaScript via unspecified vector.\n' +
              '\n' +
              '- https://vaadin.com/security/cve-2019-25028',
            permalink: 'https://github.com/advisories/GHSA-q74r-4xw3-ppx9',
            identifiers: [
              { type: 'GHSA', value: 'GHSA-q74r-4xw3-ppx9' },
              { type: 'CVE', value: 'CVE-2019-25028' }
            ],
            cvss: {
              score: 5.4,
              vectorString: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:C/C:L/I:L/A:N'
            }
          },
          vuln: {
            severity: 'MODERATE',
            package: { name: 'com.vaadin:vaadin-bom' },
            vulnerableVersionRange: '>= 8.0.0, < 8.8.5',
            firstPatchedVersion: { identifier: '8.8.5' }
          }
        },
        {
          id: 'MDI4OlJlcG9zaXRvcnlWdWxuZXJhYmlsaXR5QWxlcnQ1ODM0NzkxODg=',
          advisory: {
            summary: 'Timing side channel vulnerability in UIDL request handler in Vaadin 7 and 8',
            description: 'Non-constant-time comparison of CSRF tokens in UIDL request handler in `com.vaadin:vaadin-server` versions 7.0.0 through 7.7.23 (Vaadin 7.0.0 through 7.7.23), and 8.0.0 through 8.12.2 (Vaadin 8.0.0 through 8.12.2) allows attacker to guess a security token via timing attack\n' +
              '\n' +
              '- https://vaadin.com/security/cve-2021-31403',
            permalink: 'https://github.com/advisories/GHSA-75xc-qvxh-27f8',
            identifiers: [
              { type: 'GHSA', value: 'GHSA-75xc-qvxh-27f8' },
              { type: 'CVE', value: 'CVE-2021-31403' }
            ],
            cvss: {
              score: 4,
              vectorString: 'CVSS:3.1/AV:L/AC:H/PR:N/UI:N/S:U/C:L/I:L/A:N'
            }
          },
          vuln: {
            severity: 'MODERATE',
            package: { name: 'com.vaadin:vaadin-bom' },
            vulnerableVersionRange: '>= 8.0.0, < 8.12.3',
            firstPatchedVersion: { identifier: '8.12.3' }
          }
        },
        {
          id: 'RVA_kwDOBLHEx85Xyz5v',
          advisory: {
            summary: 'Denial of service in DataCommunicator class in Vaadin 8',
            description: 'Missing check in `DataCommunicator` class in `com.vaadin:vaadin-server` versions 8.0.0 through 8.14.0 (Vaadin 8.0.0 through 8.14.0) allows authenticated network attacker to cause heap exhaustion by requesting too many rows of data.',
            permalink: 'https://github.com/advisories/GHSA-qcgx-crrx-38v5',
            identifiers: [
              { type: 'GHSA', value: 'GHSA-qcgx-crrx-38v5' },
              { type: 'CVE', value: 'CVE-2021-33609' }
            ],
            cvss: {
              score: 4.3,
              vectorString: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:N/I:N/A:L'
            }
          },
          vuln: {
            severity: 'MODERATE',
            package: { name: 'com.vaadin:vaadin-bom' },
            vulnerableVersionRange: '>= 8.0.0, < 8.14.1',
            firstPatchedVersion: { identifier: '8.14.1' }
          }
        }
      ]
    }
  },
  {
    id: 'MDEwOlJlcG9zaXRvcnkzNDIzNzgzODE=',
    owner: { login: 'nyg' },
    name: 'swissborg-stats',
    url: 'https://github.com/nyg/swissborg-stats',
    alerts: {
      totalCount: 3,
      nodes: [
        {
          id: 'RVA_kwDOFGhHjc5Yy7_7',
          advisory: {
            summary: 'Regular expression denial of service',
            description: 'This affects the package glob-parent before 5.1.2. The enclosure regex used to check for strings ending in enclosure containing path separator.',
            permalink: 'https://github.com/advisories/GHSA-ww39-953v-wcq6',
            identifiers: [
              { type: 'GHSA', value: 'GHSA-ww39-953v-wcq6' },
              { type: 'CVE', value: 'CVE-2020-28469' }
            ],
            cvss: {
              score: 7.5,
              vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H'
            }
          },
          vuln: {
            severity: 'HIGH',
            package: { name: 'glob-parent' },
            vulnerableVersionRange: '< 5.1.2',
            firstPatchedVersion: { identifier: '5.1.2' }
          }
        },
        {
          id: 'RVA_kwDOFGhHjc5Yy7_8',
          advisory: {
            summary: 'Prototype Pollution',
            description: 'This affects the package jszip before 3.7.0. Crafting a new zip file with filenames set to Object prototype values (e.g __proto__, toString, etc) results in a returned object with a modified prototype instance.',
            permalink: 'https://github.com/advisories/GHSA-jg8v-48h5-wgxg',
            identifiers: [
              { type: 'GHSA', value: 'GHSA-jg8v-48h5-wgxg' },
              { type: 'CVE', value: 'CVE-2021-23413' }
            ],
            cvss: {
              score: 5.3,
              vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:L'
            }
          },
          vuln: {
            severity: 'MODERATE',
            package: { name: 'jszip' },
            vulnerableVersionRange: '< 3.7.0',
            firstPatchedVersion: { identifier: '3.7.0' }
          }
        },
        {
          id: 'RVA_kwDOFGhHjc5Yy7_-',
          advisory: {
            summary: ' Inefficient Regular Expression Complexity in chalk/ansi-regex',
            description: 'ansi-regex is vulnerable to Inefficient Regular Expression Complexity',
            permalink: 'https://github.com/advisories/GHSA-93q8-gq69-wqmw',
            identifiers: [
              { type: 'GHSA', value: 'GHSA-93q8-gq69-wqmw' },
              { type: 'CVE', value: 'CVE-2021-3807' }
            ],
            cvss: {
              score: 7.5,
              vectorString: 'CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H'
            }
          },
          vuln: {
            severity: 'MODERATE',
            package: { name: 'ansi-regex' },
            vulnerableVersionRange: '> 2.1.1, < 5.0.1',
            firstPatchedVersion: { identifier: '5.0.1' }
          }
        }
      ]
    }
  },
  {
    id: 'MDEwOlJlcG9zaXRvcnk0ODYyNDI5NA==',
    owner: { login: 'nyg' },
    name: 'vaadin-base-app',
    url: 'https://github.com/nyg/vaadin-base-app',
    alerts: {
      totalCount: 3,
      nodes: [
        {
          id: 'MDI4OlJlcG9zaXRvcnlWdWxuZXJhYmlsaXR5QWxlcnQ1ODM0NzE2NzQ=',
          advisory: {
            summary: 'Regular expression denial of service (ReDoS) in EmailValidator class in Vaadin 7',
            description: 'Unsafe validation RegEx in `EmailValidator` class in `com.vaadin:vaadin-server` versions 7.0.0 through 7.7.21 (Vaadin 7.0.0 through 7.7.21) allows attackers to cause uncontrolled resource consumption by submitting malicious email addresses.\n' +
              '\n' +
              '- https://vaadin.com/security/cve-2020-36320',
            permalink: 'https://github.com/advisories/GHSA-42j4-733x-5vcf',
            identifiers: [
              { type: 'GHSA', value: 'GHSA-42j4-733x-5vcf' },
              { type: 'CVE', value: 'CVE-2020-36320' }
            ],
            cvss: {
              score: 7.5,
              vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H'
            }
          },
          vuln: {
            severity: 'HIGH',
            package: { name: 'com.vaadin:vaadin-bom' },
            vulnerableVersionRange: '>= 7.0.0, < 7.7.22',
            firstPatchedVersion: { identifier: '7.7.22' }
          }
        },
        {
          id: 'MDI4OlJlcG9zaXRvcnlWdWxuZXJhYmlsaXR5QWxlcnQ1ODM0NzYwMTY=',
          advisory: {
            summary: 'Stored cross-site scripting in Grid component in Vaadin 7 and 8',
            description: 'Missing variable sanitization in `Grid` component in `com.vaadin:vaadin-server` versions 7.4.0 through 7.7.19 (Vaadin 7.4.0 through 7.7.19), and 8.0.0 through 8.8.4 (Vaadin 8.0.0 through 8.8.4) allows attacker to inject malicious JavaScript via unspecified vector.\n' +
              '\n' +
              '- https://vaadin.com/security/cve-2019-25028',
            permalink: 'https://github.com/advisories/GHSA-q74r-4xw3-ppx9',
            identifiers: [
              { type: 'GHSA', value: 'GHSA-q74r-4xw3-ppx9' },
              { type: 'CVE', value: 'CVE-2019-25028' }
            ],
            cvss: {
              score: 5.4,
              vectorString: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:C/C:L/I:L/A:N'
            }
          },
          vuln: {
            severity: 'MODERATE',
            package: { name: 'com.vaadin:vaadin-bom' },
            vulnerableVersionRange: '>= 7.4.0, < 7.7.20',
            firstPatchedVersion: { identifier: '7.7.20' }
          }
        },
        {
          id: 'MDI4OlJlcG9zaXRvcnlWdWxuZXJhYmlsaXR5QWxlcnQ1ODM0ODMwMjA=',
          advisory: {
            summary: 'Timing side channel vulnerability in UIDL request handler in Vaadin 7 and 8',
            description: 'Non-constant-time comparison of CSRF tokens in UIDL request handler in `com.vaadin:vaadin-server` versions 7.0.0 through 7.7.23 (Vaadin 7.0.0 through 7.7.23), and 8.0.0 through 8.12.2 (Vaadin 8.0.0 through 8.12.2) allows attacker to guess a security token via timing attack\n' +
              '\n' +
              '- https://vaadin.com/security/cve-2021-31403',
            permalink: 'https://github.com/advisories/GHSA-75xc-qvxh-27f8',
            identifiers: [
              { type: 'GHSA', value: 'GHSA-75xc-qvxh-27f8' },
              { type: 'CVE', value: 'CVE-2021-31403' }
            ],
            cvss: {
              score: 4,
              vectorString: 'CVSS:3.1/AV:L/AC:H/PR:N/UI:N/S:U/C:L/I:L/A:N'
            }
          },
          vuln: {
            severity: 'MODERATE',
            package: { name: 'com.vaadin:vaadin-bom' },
            vulnerableVersionRange: '>= 7.0.0, < 7.7.24',
            firstPatchedVersion: { identifier: '7.7.24' }
          }
        }
      ]
    }
  },
  {
    id: 'MDEwOlJlcG9zaXRvcnkzNDY0OTE0Nzc=',
    owner: { login: 'nyg' },
    name: 'cryptobal',
    url: 'https://github.com/nyg/cryptobal',
    alerts: {
      totalCount: 1,
      nodes: [
        {
          id: 'RVA_kwDOFKcKVc5as1dD',
          advisory: {
            summary: 'json-schema is vulnerable to Prototype Pollution',
            description: "json-schema is vulnerable to Improperly Controlled Modification of Object Prototype Attributes ('Prototype Pollution')",
            permalink: 'https://github.com/advisories/GHSA-896r-f27r-55mw',
            identifiers: [
              { type: 'GHSA', value: 'GHSA-896r-f27r-55mw' },
              { type: 'CVE', value: 'CVE-2021-3918' }
            ],
            cvss: {
              score: 9.8,
              vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H'
            }
          },
          vuln: {
            severity: 'MODERATE',
            package: { name: 'json-schema' },
            vulnerableVersionRange: '< 0.4.0',
            firstPatchedVersion: { identifier: '0.4.0' }
          }
        }
      ]
    }
  }
] */}
        {repos.map(Repo)}
      </div>
    </Layout>
  )
}
