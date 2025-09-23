import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, Folder, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

interface TreeNode {
  id: string;
  code: string;
  title: string;
  type: 'icd11' | 'namaste' | 'tm2';
  children?: TreeNode[];
  expanded?: boolean;
}

interface TreeNavigationProps {
  filters: {
    icd11: boolean;
    namaste: boolean;
    tm2: boolean;
  };
  onCodeSelect: (code: string | null) => void;
  onSystemSelect: (system: string | null) => void;
}

// Convert API data to tree nodes
const convertToTreeNodes = (icdCodes: any[]): TreeNode[] => {
  const buildNode = (code: any): TreeNode => {
    const childCodes = code.children ? 
      icdCodes.filter(child => code.children.includes(child.code)) : [];
    
    return {
      id: code.id,
      code: code.code,
      title: code.title,
      type: 'icd11' as const,
      children: childCodes.length > 0 ? childCodes.map(buildNode) : undefined
    };
  };

  return icdCodes
    .filter(code => !code.parentCode) // Root level items
    .map(buildNode);
};

export default function TreeNavigation({ filters, onCodeSelect, onSystemSelect }: TreeNavigationProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Fetch ICD-11 hierarchy from API
  const { data: icdHierarchy, isLoading } = useQuery({
    queryKey: ['/api/icd11/hierarchy'],
    queryFn: api.getIcdHierarchy,
  });

  // Fetch NAMASTE codes by system
  const { data: ayuCodes } = useQuery({
    queryKey: ['/api/namaste/system/AYU'],
    queryFn: () => api.getNamasteBySystem('AYU'),
    enabled: filters.namaste,
  });

  const { data: sidCodes } = useQuery({
    queryKey: ['/api/namaste/system/SID'],
    queryFn: () => api.getNamasteBySystem('SID'),
    enabled: filters.namaste,
  });

  const { data: unaCodes } = useQuery({
    queryKey: ['/api/namaste/system/UNA'], 
    queryFn: () => api.getNamasteBySystem('UNA'),
    enabled: filters.namaste,
  });

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const handleNodeClick = (node: TreeNode) => {
    if (node.children && node.children.length > 0) {
      toggleNode(node.id);
    } else {
      onCodeSelect(node.code);
      onSystemSelect(node.type);
    }
  };

  const getNodeColor = (type: TreeNode['type']) => {
    switch (type) {
      case 'icd11': return 'text-primary';
      case 'namaste': return 'text-secondary';
      case 'tm2': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  const shouldShowNode = (type: TreeNode['type']) => {
    return filters[type];
  };

  const renderTreeNode = (node: TreeNode, depth = 0) => {
    if (!shouldShowNode(node.type)) return null;

    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} style={{ marginLeft: `${depth * 1.5}rem` }}>
        <div
          className={cn(
            "tree-item p-2 rounded cursor-pointer transition-colors hover:bg-muted",
            depth === 0 ? "bg-muted/50" : ""
          )}
          onClick={() => handleNodeClick(node)}
          data-testid={`tree-node-${node.code}`}
        >
          <div className="flex items-center">
            {hasChildren && (
              <>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground mr-2" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground mr-2" />
                )}
              </>
            )}
            {!hasChildren && <div className="w-6" />}
            
            {hasChildren ? (
              <Folder className={cn("w-4 h-4 mr-2", getNodeColor(node.type))} />
            ) : (
              <FileText className={cn("w-4 h-4 mr-2", getNodeColor(node.type))} />
            )}
            
            <span className="text-sm font-medium">{node.title}</span>
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div className="mt-1">
            {node.children?.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-8 bg-muted rounded animate-pulse" />
        ))}
      </div>
    );
  }

  // Build tree data from API responses
  const treeData: TreeNode[] = [];

  // Add ICD-11 data if enabled
  if (filters.icd11 && icdHierarchy) {
    treeData.push(...convertToTreeNodes(icdHierarchy));
  }

  // Add NAMASTE data if enabled
  if (filters.namaste) {
    const namasteNodes: TreeNode[] = [];
    if (ayuCodes) {
      namasteNodes.push(...ayuCodes.map(code => ({
        id: code.id,
        code: code.code,
        title: `${code.title} (Ayurveda)`,
        type: 'namaste' as const
      })));
    }
    if (sidCodes) {
      namasteNodes.push(...sidCodes.map(code => ({
        id: code.id,
        code: code.code,
        title: `${code.title} (Siddha)`,
        type: 'namaste' as const
      })));
    }
    if (unaCodes) {
      namasteNodes.push(...unaCodes.map(code => ({
        id: code.id,
        code: code.code,
        title: `${code.title} (Unani)`,
        type: 'namaste' as const
      })));
    }
    
    if (namasteNodes.length > 0) {
      treeData.push({
        id: 'namaste-root',
        code: 'NAMASTE',
        title: 'NAMASTE Classifications',
        type: 'namaste',
        children: namasteNodes
      });
    }
  }

  // Add TM2 placeholder if enabled
  if (filters.tm2) {
    treeData.push({
      id: 'tm2-root',
      code: '26',
      title: 'Traditional Medicine Module 2 (TM2)',
      type: 'tm2'
    });
  }

  return (
    <div className="space-y-1">
      {treeData.map(node => renderTreeNode(node))}
      
      {/* Empty state when no filters are selected */}
      {!filters.icd11 && !filters.namaste && !filters.tm2 && (
        <div className="text-center py-8 text-muted-foreground">
          <Folder className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Select at least one filter to view categories</p>
        </div>
      )}
      
      {/* Empty state when no data available */}
      {(filters.icd11 || filters.namaste || filters.tm2) && treeData.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No data available</p>
        </div>
      )}
    </div>
  );
}
