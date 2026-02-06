import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, Search, Tag, Users, Shield, FileText, Info } from 'lucide-react';

const TaxonomyNavigator = () => {
  const [expandedNodes, setExpandedNodes] = useState(new Set(['safrep.root']));
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('tree'); // 'tree' or 'flat'

  const taxonomyData = {
    "taxonomy_id": "safrep",
    "version": "1.0.0",
    "title": "Safeguards Reporting & Declarations Taxonomy",
    "root": {
      "id": "safrep.root",
      "label": "Safeguards reporting domain",
      "definition": "Taxonomy for organizing safeguards-relevant reporting, declarations, exchanges, and QA workflows.",
      "sensitivity_level": "Low",
      "examples": ["Tag an AP declaration package", "Tag a clarification response bundle"],
      "tags": ["safeguards", "reporting", "declaration", "information-management"],
      "stakeholders": "SRA/SSAC, IAEA liaison, policy analysts, data engineers",
      "related_nodes": [],
      "children": [
        {
          "id": "safrep.instrument",
          "label": "Reporting instruments",
          "definition": "Types of submissions and exchanges used in safeguards-related reporting.",
          "sensitivity_level": "Low",
          "examples": ["CSA accounting report", "AP Article 2 declaration"],
          "tags": ["document-type", "submission"],
          "stakeholders": "Reporting staff, analysts, records managers",
          "related_nodes": [],
          "children": [
            {
              "id": "safrep.instrument.csa",
              "label": "CSA instruments",
              "definition": "Reports and information typically exchanged under CSA frameworks.",
              "sensitivity_level": "Low",
              "examples": ["Accounting report package", "Design information update"],
              "tags": ["csa", "infcirc153"],
              "stakeholders": "SSAC/SRA, operators, safeguards analysts",
              "related_nodes": ["safrep.framework.csa-infcirc153"],
              "children": [
                {
                  "id": "safrep.instrument.csa.accounting-report",
                  "label": "Accounting report",
                  "definition": "Structured submission of declared accounting information for safeguards purposes.",
                  "sensitivity_level": "Medium",
                  "examples": ["Inventory change submission", "Material balance reporting package"],
                  "tags": ["accounting", "nma", "inventory"],
                  "stakeholders": "SSAC accountants, facility safeguards officers",
                  "related_nodes": ["safrep.qa.data-quality", "safrep.actor.operator"],
                  "children": []
                },
                {
                  "id": "safrep.instrument.csa.design-info",
                  "label": "Design information",
                  "definition": "High-level facility/LOF design information and updates for safeguards planning.",
                  "sensitivity_level": "Medium",
                  "examples": ["Design information update letter", "DIQ-related submission"],
                  "tags": ["design-information", "diq"],
                  "stakeholders": "Operators, SRA, safeguards information analysts",
                  "related_nodes": ["safrep.content.locations"],
                  "children": []
                },
                {
                  "id": "safrep.instrument.csa.special-report",
                  "label": "Special report",
                  "definition": "Non-routine report addressing unusual circumstances relevant to safeguards.",
                  "sensitivity_level": "Medium",
                  "examples": ["Exceptional status update", "Notification of unusual record-impacting event"],
                  "tags": ["special-report", "notification"],
                  "stakeholders": "SRA focal point, safeguards leads",
                  "related_nodes": ["safrep.process.resolve"],
                  "children": []
                }
              ]
            },
            {
              "id": "safrep.instrument.ap",
              "label": "AP declarations",
              "definition": "Declarations and updates associated with Additional Protocol frameworks.",
              "sensitivity_level": "Low",
              "examples": ["Annual AP submission", "Corrected AP update"],
              "tags": ["additional-protocol", "infcirc540"],
              "stakeholders": "AP coordinator, legal/policy units, analysts",
              "related_nodes": ["safrep.framework.ap-infcirc540"],
              "children": [
                {
                  "id": "safrep.instrument.ap.article2",
                  "label": "Article 2 declaration",
                  "definition": "Declared information categories provided under AP Article 2 (high level).",
                  "sensitivity_level": "Low",
                  "examples": ["General R&D location declaration", "Site/building description summary"],
                  "tags": ["ap-article2", "declaration-type"],
                  "stakeholders": "AP national coordinator, safeguards analysts",
                  "related_nodes": ["safrep.content.rnd-general", "safrep.content.locations.site-buildings"],
                  "children": []
                },
                {
                  "id": "safrep.instrument.ap.article3",
                  "label": "Timing and updates",
                  "definition": "Timing rules and update patterns for submitting AP information.",
                  "sensitivity_level": "Low",
                  "examples": ["Due-date calendar management", "Annual cycle tracking"],
                  "tags": ["due-dates", "updates"],
                  "stakeholders": "SRA secretariat, program managers",
                  "related_nodes": ["safrep.process.submit"],
                  "children": []
                },
                {
                  "id": "safrep.instrument.ap.complementary-access-info",
                  "label": "CA support info",
                  "definition": "Administrative information supporting AP-related access coordination.",
                  "sensitivity_level": "Medium",
                  "examples": ["Contact lists", "Managed-access notes (high level)"],
                  "tags": ["complementary-access", "coordination"],
                  "stakeholders": "Access coordinators, legal counsel",
                  "related_nodes": ["safrep.process.collect"],
                  "children": []
                }
              ]
            },
            {
              "id": "safrep.instrument.exchange",
              "label": "Supporting exchanges",
              "definition": "Non-core exchanges enabling processing, interpretation, and auditability.",
              "sensitivity_level": "Low",
              "examples": ["Transmittal cover letter", "Submission change log"],
              "tags": ["metadata", "audit-trail"],
              "stakeholders": "Records managers, data engineers",
              "related_nodes": [],
              "children": [
                {
                  "id": "safrep.instrument.amplification",
                  "label": "Amplification",
                  "definition": "Clarifications or expansions of previously provided information.",
                  "sensitivity_level": "Low",
                  "examples": ["Clarify an entity name", "Resolve an inconsistency statement"],
                  "tags": ["clarification", "amplification"],
                  "stakeholders": "SRA focal point, analysts",
                  "related_nodes": ["safrep.qa.consistency-checks", "safrep.process.resolve"],
                  "children": []
                }
              ]
            }
          ]
        },
        {
          "id": "safrep.content",
          "label": "Content categories",
          "definition": "Topic lenses for classifying the subject matter of submissions.",
          "sensitivity_level": "Low",
          "examples": ["Tag by sites/buildings", "Tag by transfers/notifications"],
          "tags": ["topic", "classification"],
          "stakeholders": "Analysts, OSINT, data engineering",
          "related_nodes": [],
          "children": [
            {
              "id": "safrep.content.locations",
              "label": "Locations and sites",
              "definition": "High-level information about sites, facilities, and relevant locations.",
              "sensitivity_level": "Medium",
              "examples": ["Site list summary", "LOF listing (high level)"],
              "tags": ["site", "facility", "lof"],
              "stakeholders": "SRA, operators, analysts",
              "related_nodes": ["safrep.instrument.csa.design-info"],
              "children": [
                {
                  "id": "safrep.content.locations.site-buildings",
                  "label": "Site buildings",
                  "definition": "General building/use descriptions and site-level structure summaries.",
                  "sensitivity_level": "Medium",
                  "examples": ["Laboratory building noted", "Administrative building listing"],
                  "tags": ["buildings", "site-description"],
                  "stakeholders": "AP coordinator, records staff",
                  "related_nodes": ["safrep.instrument.ap.article2"],
                  "children": []
                }
              ]
            },
            {
              "id": "safrep.content.material-accountancy",
              "label": "Material accountancy",
              "definition": "Reporting-focused concepts describing declared accountancy information.",
              "sensitivity_level": "Medium",
              "examples": ["Reference to material balance period", "SRD context note"],
              "tags": ["mba", "mbp", "muf", "srd"],
              "stakeholders": "SSAC, safeguards analysts",
              "related_nodes": ["safrep.instrument.csa.accounting-report"],
              "children": [
                {
                  "id": "safrep.content.material-accountancy.mbe",
                  "label": "MBE",
                  "definition": "High-level analytical review of declared balances for anomalies and trends.",
                  "sensitivity_level": "Medium",
                  "examples": ["Trend review note", "Anomaly triage summary"],
                  "tags": ["mbe", "balance-review"],
                  "stakeholders": "Safeguards analysts, auditors",
                  "related_nodes": ["safrep.output.risk-screen"],
                  "children": []
                }
              ]
            },
            {
              "id": "safrep.content.trade-notifications",
              "label": "Transfers",
              "definition": "Declared transfers/notifications and related administrative information.",
              "sensitivity_level": "Medium",
              "examples": ["Import confirmation note", "Export notification metadata"],
              "tags": ["transfer", "import", "export"],
              "stakeholders": "Compliance officers, customs liaison",
              "related_nodes": [],
              "children": []
            },
            {
              "id": "safrep.content.rnd-general",
              "label": "General R&D",
              "definition": "High-level declarations of relevant R&D activities without technical detail.",
              "sensitivity_level": "Medium",
              "examples": ["University collaboration (general)", "Funded research location list"],
              "tags": ["rnd", "declaration"],
              "stakeholders": "AP coordinator, research administrators",
              "related_nodes": [],
              "children": []
            },
            {
              "id": "safrep.content.plans-general",
              "label": "General plans",
              "definition": "High-level forward-looking plans captured as non-technical summaries.",
              "sensitivity_level": "Medium",
              "examples": ["Program expansion statement", "Planning memo tag"],
              "tags": ["plans", "program"],
              "stakeholders": "Policy planners, AP coordinator",
              "related_nodes": [],
              "children": []
            }
          ]
        },
        {
          "id": "safrep.actor",
          "label": "Actors",
          "definition": "Roles that create, submit, validate, receive, and use safeguards information.",
          "sensitivity_level": "Low",
          "examples": ["Tag as operator-provided", "Assign workflow ownership"],
          "tags": ["roles", "governance"],
          "stakeholders": "All participants",
          "related_nodes": [],
          "children": [
            {
              "id": "safrep.actor.sra",
              "label": "SRA/SSAC",
              "definition": "State or regional authority coordinating safeguards reporting and liaison.",
              "sensitivity_level": "Low",
              "examples": ["AP coordination office", "SSAC administration unit"],
              "tags": ["sra", "ssac"],
              "stakeholders": "Government focal points",
              "related_nodes": ["safrep.process.submit"],
              "children": []
            },
            {
              "id": "safrep.actor.operator",
              "label": "Operator",
              "definition": "Facility/LOF operator producing records and reporting inputs.",
              "sensitivity_level": "Low",
              "examples": ["Facility safeguards officer input", "Operator declaration draft"],
              "tags": ["operator", "facility"],
              "stakeholders": "Operators, regulators",
              "related_nodes": ["safrep.process.collect"],
              "children": []
            },
            {
              "id": "safrep.actor.iaea-interface",
              "label": "IAEA interface",
              "definition": "Administrative interfaces for communication and issue resolution.",
              "sensitivity_level": "Low",
              "examples": ["Official mailbox process", "Designated contact points"],
              "tags": ["communication", "interface"],
              "stakeholders": "SRA liaison, records managers",
              "related_nodes": ["safrep.process.resolve"],
              "children": []
            },
            {
              "id": "safrep.actor.osint-analyst",
              "label": "OSINT users",
              "definition": "Users of public information for contextualization and corroboration.",
              "sensitivity_level": "Low",
              "examples": ["Media report tagging", "Public record cross-reference"],
              "tags": ["osint", "public-sources"],
              "stakeholders": "OSINT teams, civil society",
              "related_nodes": ["safrep.output.summary"],
              "children": []
            }
          ]
        },
        {
          "id": "safrep.process",
          "label": "Processes",
          "definition": "Lifecycle from intake through submission, correction, and archival.",
          "sensitivity_level": "Low",
          "examples": ["Annual AP cycle", "Quarterly reporting governance"],
          "tags": ["workflow", "lifecycle"],
          "stakeholders": "Program managers, data engineers",
          "related_nodes": [],
          "children": [
            {
              "id": "safrep.process.collect",
              "label": "Collect",
              "definition": "Gather information from operators/sources into State systems.",
              "sensitivity_level": "Low",
              "examples": ["Intake checklist", "Document registration"],
              "tags": ["intake", "collection"],
              "stakeholders": "SRA information managers",
              "related_nodes": ["safrep.standard.identifiers"],
              "children": []
            },
            {
              "id": "safrep.process.validate",
              "label": "Validate",
              "definition": "Administrative and content QA prior to submission.",
              "sensitivity_level": "Low",
              "examples": ["Cross-field checks", "Internal approvals"],
              "tags": ["validation", "review"],
              "stakeholders": "QA leads, legal reviewers",
              "related_nodes": ["safrep.qa.data-quality"],
              "children": []
            },
            {
              "id": "safrep.process.submit",
              "label": "Submit",
              "definition": "Controlled submission process with logging and metadata.",
              "sensitivity_level": "Low",
              "examples": ["Transmittal cover note", "Receipt record"],
              "tags": ["submission", "audit"],
              "stakeholders": "SRA liaison",
              "related_nodes": ["safrep.qa.traceability"],
              "children": []
            },
            {
              "id": "safrep.process.resolve",
              "label": "Resolve",
              "definition": "Consultative resolution of inconsistencies, questions, and updates.",
              "sensitivity_level": "Low",
              "examples": ["Clarification response", "Corrected declaration"],
              "tags": ["resolution", "correction"],
              "stakeholders": "Analysts, SRA focal points",
              "related_nodes": ["safrep.instrument.amplification"],
              "children": []
            }
          ]
        },
        {
          "id": "safrep.qa",
          "label": "Data quality",
          "definition": "Controls ensuring completeness, consistency, traceability, and safe handling.",
          "sensitivity_level": "Low",
          "examples": ["Duplicate detection", "Required-field enforcement"],
          "tags": ["qa", "control"],
          "stakeholders": "Data engineers, auditors",
          "related_nodes": [],
          "children": [
            {
              "id": "safrep.qa.completeness",
              "label": "Completeness",
              "definition": "Ensures expected fields/documents exist for a reporting cycle.",
              "sensitivity_level": "Low",
              "examples": ["Missing attachment alert", "Overdue declaration flag"],
              "tags": ["completeness"],
              "stakeholders": "QA team",
              "related_nodes": [],
              "children": []
            },
            {
              "id": "safrep.qa.consistency-checks",
              "label": "Consistency",
              "definition": "Cross-document coherence checks without technical inference.",
              "sensitivity_level": "Low",
              "examples": ["Name matches prior submission", "Date ranges align"],
              "tags": ["consistency", "cross-check"],
              "stakeholders": "QA + analysts",
              "related_nodes": [],
              "children": []
            },
            {
              "id": "safrep.qa.traceability",
              "label": "Traceability",
              "definition": "Links submissions to sources, approvals, and revision history.",
              "sensitivity_level": "Low",
              "examples": ["Change log", "Versioned attachments"],
              "tags": ["audit-trail", "provenance"],
              "stakeholders": "Records management",
              "related_nodes": [],
              "children": []
            },
            {
              "id": "safrep.qa.confidentiality",
              "label": "Confidentiality",
              "definition": "Administrative handling controls for sensitive safeguards information.",
              "sensitivity_level": "Medium",
              "examples": ["Role-based access", "Redacted public summary workflow"],
              "tags": ["confidentiality", "access-control"],
              "stakeholders": "Security/records officers",
              "related_nodes": [],
              "children": []
            },
            {
              "id": "safrep.qa.data-quality",
              "label": "Data quality controls",
              "definition": "Umbrella node for operationalizing checks, exceptions, and remediation.",
              "sensitivity_level": "Low",
              "examples": ["QA checklist", "Exception queue triage"],
              "tags": ["data-quality", "qa"],
              "stakeholders": "QA leads, data engineering",
              "related_nodes": ["safrep.qa.completeness", "safrep.qa.consistency-checks"],
              "children": []
            }
          ]
        },
        {
          "id": "safrep.standard",
          "label": "Standards",
          "definition": "Normalized fields, identifiers, and formats enabling machine processing.",
          "sensitivity_level": "Low",
          "examples": ["Controlled vocabulary for doc types", "Standardized entity naming"],
          "tags": ["schema", "interoperability"],
          "stakeholders": "Data engineers, system owners",
          "related_nodes": [],
          "children": [
            {
              "id": "safrep.standard.identifiers",
              "label": "Identifiers",
              "definition": "Controlled identifiers for submissions, locations, organizations, documents.",
              "sensitivity_level": "Low",
              "examples": ["Submission ID", "Internal registry number"],
              "tags": ["id", "registry"],
              "stakeholders": "Data stewards",
              "related_nodes": [],
              "children": []
            },
            {
              "id": "safrep.standard.format",
              "label": "Formats",
              "definition": "Structured templates and exchange conventions enabling ingestion.",
              "sensitivity_level": "Low",
              "examples": ["Delimited file template", "Structured submission form"],
              "tags": ["format", "template"],
              "stakeholders": "Data engineering, reporting staff",
              "related_nodes": [],
              "children": []
            }
          ]
        },
        {
          "id": "safrep.framework",
          "label": "Framework mapping",
          "definition": "Links reporting artifacts to governing instruments and mandates.",
          "sensitivity_level": "Low",
          "examples": ["Tag as CSA-related", "Tag as AP-related"],
          "tags": ["mapping", "compliance"],
          "stakeholders": "Legal/policy, compliance",
          "related_nodes": [],
          "children": [
            {
              "id": "safrep.framework.csa-infcirc153",
              "label": "CSA mapping",
              "definition": "Mapping node for CSA-related obligations and reporting concepts.",
              "sensitivity_level": "Low",
              "examples": ["CSA reporting set tag", "CSA objective reference tag"],
              "tags": ["csa", "infcirc153"],
              "stakeholders": "Legal/policy, safeguards analysts",
              "related_nodes": [],
              "children": []
            },
            {
              "id": "safrep.framework.ap-infcirc540",
              "label": "AP mapping",
              "definition": "Mapping node for AP-related declarations and information.",
              "sensitivity_level": "Low",
              "examples": ["AP Article 2 tag", "AP update tag"],
              "tags": ["additional-protocol", "infcirc540"],
              "stakeholders": "AP coordinators",
              "related_nodes": [],
              "children": []
            },
            {
              "id": "safrep.framework.unsc1540",
              "label": "UNSCR 1540 linkage",
              "definition": "High-level linkage to national compliance narratives relevant to UNSCR 1540.",
              "sensitivity_level": "Low",
              "examples": ["Legislative update summary", "Outreach program summary"],
              "tags": ["unsc1540", "legislation"],
              "stakeholders": "National focal points, compliance",
              "related_nodes": [],
              "children": []
            },
            {
              "id": "safrep.framework.npt",
              "label": "NPT linkage",
              "definition": "High-level linkage to NPT obligations and review-cycle analysis.",
              "sensitivity_level": "Low",
              "examples": ["NPT review conference brief tag", "Treaty interpretation memo tag"],
              "tags": ["npt", "treaty"],
              "stakeholders": "Policy analysts",
              "related_nodes": [],
              "children": []
            }
          ]
        },
        {
          "id": "safrep.output",
          "label": "Outputs",
          "definition": "Derivative products created from submissions for decision support.",
          "sensitivity_level": "Low",
          "examples": ["Internal dashboard", "Trend summary memo"],
          "tags": ["analytics", "summary"],
          "stakeholders": "Leadership, analysts",
          "related_nodes": [],
          "children": [
            {
              "id": "safrep.output.summary",
              "label": "Non-sensitive summaries",
              "definition": "Public-safe or internal high-level summaries avoiding operational specifics.",
              "sensitivity_level": "Low",
              "examples": ["Executive brief", "Issue log summary"],
              "tags": ["summary", "brief"],
              "stakeholders": "Policy, communications",
              "related_nodes": [],
              "children": []
            },
            {
              "id": "safrep.output.risk-screen",
              "label": "Risk screening flags",
              "definition": "Non-actionable indicators used to prioritize review.",
              "sensitivity_level": "Medium",
              "examples": ["Missing update flag", "Inconsistency pending flag"],
              "tags": ["prioritization", "triage"],
              "stakeholders": "Analysts, QA leads",
              "related_nodes": ["safrep.qa.consistency-checks"],
              "children": []
            }
          ]
        }
      ]
    }
  };

  // Build a flat index of all nodes for search and lookup
  const nodeIndex = useMemo(() => {
    const index = {};
    const traverse = (node) => {
      index[node.id] = node;
      node.children?.forEach(traverse);
    };
    traverse(taxonomyData.root);
    return index;
  }, []);

  // Search filtering
  const matchesSearch = (node, term) => {
    if (!term) return true;
    const searchLower = term.toLowerCase();
    return (
      node.label?.toLowerCase().includes(searchLower) ||
      node.definition?.toLowerCase().includes(searchLower) ||
      node.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
      node.id?.toLowerCase().includes(searchLower)
    );
  };

  const filteredNodes = useMemo(() => {
    if (!searchTerm) return null;
    const results = [];
    Object.values(nodeIndex).forEach(node => {
      if (matchesSearch(node, searchTerm)) {
        results.push(node);
      }
    });
    return results;
  }, [searchTerm, nodeIndex]);

  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const selectNode = (node) => {
    setSelectedNode(node);
  };

  const getSensitivityColor = (level) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'High': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const TreeNode = ({ node, level = 0 }) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNode?.id === node.id;
    const matches = matchesSearch(node, searchTerm);

    if (searchTerm && !matches) {
      // In search mode, only show matching nodes
      return null;
    }

    return (
      <div className={`${searchTerm && matches ? 'bg-yellow-50' : ''}`}>
        <div
          className={`flex items-start py-2 px-3 cursor-pointer hover:bg-blue-50 ${
            isSelected ? 'bg-blue-100 border-l-4 border-blue-500' : ''
          }`}
          style={{ paddingLeft: `${level * 24 + 12}px` }}
          onClick={() => selectNode(node)}
        >
          <div className="flex items-center min-w-0 flex-1">
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode(node.id);
                }}
                className="mr-2 flex-shrink-0"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>
            )}
            {!hasChildren && <div className="w-6 mr-2 flex-shrink-0" />}
            <div className="min-w-0 flex-1">
              <div className="font-medium text-gray-900">{node.label}</div>
              <div className="text-xs text-gray-500 truncate">{node.id}</div>
            </div>
            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getSensitivityColor(node.sensitivity_level)}`}>
              {node.sensitivity_level}
            </span>
          </div>
        </div>
        {isExpanded && hasChildren && (
          <div>
            {node.children.map((child) => (
              <TreeNode key={child.id} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const DetailPanel = ({ node }) => {
    if (!node) {
      return (
        <div className="flex items-center justify-center h-full text-gray-400">
          <div className="text-center">
            <Info className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Select a node to view details</p>
          </div>
        </div>
      );
    }

    const relatedNodes = node.related_nodes?.map(id => nodeIndex[id]).filter(Boolean) || [];

    return (
      <div className="h-full overflow-y-auto p-6">
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900">{node.label}</h2>
            <span className={`px-3 py-1 text-sm rounded-full ${getSensitivityColor(node.sensitivity_level)}`}>
              {node.sensitivity_level}
            </span>
          </div>
          <p className="text-sm text-gray-500 font-mono">{node.id}</p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Definition
            </h3>
            <p className="text-gray-800">{node.definition}</p>
          </div>

          {node.examples && node.examples.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Examples</h3>
              <ul className="list-disc list-inside space-y-1">
                {node.examples.map((example, idx) => (
                  <li key={idx} className="text-gray-700 text-sm">{example}</li>
                ))}
              </ul>
            </div>
          )}

          {node.tags && node.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {node.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {node.stakeholders && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Stakeholders
              </h3>
              <p className="text-gray-700 text-sm">{node.stakeholders}</p>
            </div>
          )}

          {relatedNodes.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Related Nodes</h3>
              <div className="space-y-2">
                {relatedNodes.map((relNode) => (
                  <button
                    key={relNode.id}
                    onClick={() => selectNode(relNode)}
                    className="block w-full text-left p-2 bg-gray-50 hover:bg-blue-50 rounded border border-gray-200"
                  >
                    <div className="font-medium text-sm text-blue-600">{relNode.label}</div>
                    <div className="text-xs text-gray-500">{relNode.id}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {node.children && node.children.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Children ({node.children.length})
              </h3>
              <div className="space-y-1">
                {node.children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => selectNode(child)}
                    className="block w-full text-left p-2 hover:bg-gray-50 rounded"
                  >
                    <div className="font-medium text-sm">{child.label}</div>
                    <div className="text-xs text-gray-500">{child.id}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const FlatListView = () => {
    const nodes = filteredNodes || Object.values(nodeIndex);
    return (
      <div className="divide-y divide-gray-200">
        {nodes.map((node) => (
          <div
            key={node.id}
            className={`p-3 cursor-pointer hover:bg-blue-50 ${
              selectedNode?.id === node.id ? 'bg-blue-100' : ''
            }`}
            onClick={() => selectNode(node)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900">{node.label}</div>
                <div className="text-xs text-gray-500 font-mono">{node.id}</div>
                <div className="text-sm text-gray-600 mt-1 line-clamp-2">{node.definition}</div>
              </div>
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full flex-shrink-0 ${getSensitivityColor(node.sensitivity_level)}`}>
                {node.sensitivity_level}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{taxonomyData.title}</h1>
            <p className="text-sm text-gray-600">Version {taxonomyData.version}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('tree')}
              className={`px-3 py-1 text-sm rounded ${
                viewMode === 'tree' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border'
              }`}
            >
              Tree View
            </button>
            <button
              onClick={() => setViewMode('flat')}
              className={`px-3 py-1 text-sm rounded ${
                viewMode === 'flat' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border'
              }`}
            >
              List View
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search taxonomy (labels, definitions, tags, IDs)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Tree/List Panel */}
        <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
          {viewMode === 'tree' ? (
            <TreeNode node={taxonomyData.root} />
          ) : (
            <FlatListView />
          )}
        </div>

        {/* Detail Panel */}
        <div className="w-1/2 bg-gray-50">
          <DetailPanel node={selectedNode} />
        </div>
      </div>
    </div>
  );
};

export default TaxonomyNavigator;