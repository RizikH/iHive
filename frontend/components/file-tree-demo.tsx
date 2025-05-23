import { File, Folder, Tree } from "@/components/magicui/file-tree"
import { useState, useRef, useEffect, useCallback } from 'react';
import { FileContent } from '@/components/magicui/file-tree';
import { 
  FiPlus, 
  FiTrash2, 
  FiEdit2, 
  FiCheck, 
  FiX 
} from 'react-icons/fi';
import styles from '@/app/styles/file-tree.module.css';

// =============================================
// Types and Interfaces
// =============================================

interface FileTreeDemoProps {
  onFileSelect: (fileId: string, content: string, fileName: string) => void;
  onContentUpdate: (fileId: string, content: string) => void;
  currentFileId: string | null;
  onFileDelete: (fileId: string) => void;
  files?: Array<{ id: string; title: string; description: string }>;
  isPreview?: boolean;
  repoId?: string;
}

// =============================================
// File Tree Component
// =============================================

export default function FileTreeDemo({ 
  onFileSelect, 
  onContentUpdate: originalOnContentUpdate, 
  currentFileId, 
  onFileDelete,
  files: initialFiles,
  isPreview = false,
  repoId
}: FileTreeDemoProps) {
  const [fileList, setFileList] = useState<FileContent[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());
  const [fileContentsMap, setFileContentsMap] = useState<Record<string, string>>({});
  const fileTreeRef = useRef<HTMLDivElement>(null);
  const onContentUpdateRef = useRef(originalOnContentUpdate);

  useEffect(() => {
    onContentUpdateRef.current = originalOnContentUpdate;
  }, [originalOnContentUpdate]);

  useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      const files: FileContent[] = initialFiles.map(idea => ({
        id: idea.id.toString(),
        name: idea.title,
        type: 'file',
        content: idea.description,
      }));
      setFileList(files);
      const contentsMap: Record<string, string> = {};
      initialFiles.forEach(idea => {
        contentsMap[idea.id.toString()] = idea.description;
      });
      setFileContentsMap(contentsMap);
    }
  }, [initialFiles]);

  useEffect(() => {
    if (currentFileId) {
      const updateFileContent = (items: FileContent[]): FileContent[] => {
        return items.map(item => {
          if (item.id === currentFileId) {
            return { ...item, content: fileContentsMap[currentFileId] || item.content };
          }
          if (item.children) {
            return { ...item, children: updateFileContent(item.children) };
          }
          return item;
        });
      };
      setFileList(prevFiles => updateFileContent(prevFiles));
    }
  }, [currentFileId, fileContentsMap]);

  useEffect(() => {
    const handleContentUpdates = () => {
      const findAndUpdateContent = (items: FileContent[]) => {
        items.forEach(item => {
          if (item.type === 'file' && item.content !== undefined) {
            if (fileContentsMap[item.id] !== item.content) {
              setFileContentsMap(prev => ({
                ...prev,
                [item.id]: item.content || ''
              }));
            }
          }
          if (item.children) {
            findAndUpdateContent(item.children);
          }
        });
      };
      findAndUpdateContent(fileList);
    };
    handleContentUpdates();
  }, [fileList, fileContentsMap]);

  useEffect(() => {
    if (fileList) {
      const uniqueFileIds = new Set<string>();
      const notifyForUniqueFiles = (items: FileContent[]) => {
        items.forEach(file => {
          if (file.type === 'file' && !uniqueFileIds.has(file.id) && file.content !== undefined) {
            uniqueFileIds.add(file.id);
            onContentUpdateRef.current(file.id, file.content || '');
          }
          if (file.children) {
            notifyForUniqueFiles(file.children);
          }
        });
      };
      notifyForUniqueFiles(fileList);
    }
  }, [fileList]);

  useEffect(() => {
    const expandedItemsArray = Array.from(openFolders);
    if (expandedItemsArray.length > 0) {
      setFileList(prev => [...prev]);
    }
  }, [openFolders]);


  // =============================================
  // File Creation Handlers
  // =============================================
  
  const handleCreateFile = (parentId: string | null = null) => {
    if (!newFileName.trim()) {
      alert('Please enter a file name');
      return;
    }

    const newFileId = Date.now().toString();
    const newFile: FileContent = {
      id: newFileId,
      name: newFileName.trim(),
      type: 'file',
      content: '',
      parentId: parentId || undefined
    };

    setFileList(prevFiles => {
      if (!parentId) {
        return [...prevFiles, newFile];
      }

      return prevFiles.map(item => updateFileStructure(item, parentId, newFile));
    });

    setTimeout(() => {
      onFileSelect(newFileId, '', newFileName.trim());
    }, 0);

    setNewFileName('');
    setIsCreatingFile(false);
  };

  const handleCreateFolder = (parentId: string | null = null) => {
    if (!newFileName.trim()) {
      alert('Please enter a folder name');
      return;
    }

    const newFolder: FileContent = {
      id: Date.now().toString(),
      name: newFileName.trim(),
      type: 'folder',
      content: '',
      parentId: parentId || undefined,
      children: []
    };

    setFileList(prevFiles => {
      if (!parentId) {
        return [...prevFiles, newFolder];
      }

      return prevFiles.map(item => updateFileStructure(item, parentId, newFolder));
    });

    setOpenFolders(prev => {
      const newSet = new Set(prev);
      newSet.add(newFolder.id);
      return newSet;
    });

    setNewFileName('');
    setIsCreatingFile(false);
  };

  // =============================================
  // File Structure Manipulation
  // =============================================
  
  const updateFileStructure = (item: FileContent, parentId: string, newItem: FileContent): FileContent => {
    if (item.id === parentId) {
      return {
        ...item,
        children: [...(item.children || []), newItem]
      };
    }

    if (item.children) {
      return {
        ...item,
        children: item.children.map(child => updateFileStructure(child, parentId, newItem))
      };
    }

    return item;
  };

  const handleDelete = (id: string, type: 'file' | 'folder') => {
    const confirmMessage = type === 'folder' 
      ? 'Are you sure you want to delete this folder and all its contents?' 
      : 'Are you sure you want to delete this file?';
    
    if (window.confirm(confirmMessage)) {
      deleteFileOrFolder(id);
      onFileDelete(id);
    }
  };

  const deleteFileOrFolder = (id: string) => {
    setFileList(prevFiles => {
      const deleteFromArray = (items: FileContent[]): FileContent[] => {
        return items.filter(item => {
          if (item.id === id) {
            return false;
          }
          if (item.children) {
            item.children = deleteFromArray(item.children);
          }
          return true;
        });
      };
      
      return deleteFromArray(prevFiles);
    });

    setFileContentsMap(prev => {
      const newMap = { ...prev };
      delete newMap[id];
      return newMap;
    });
  };

  // =============================================
  // File Renaming Handlers
  // =============================================
  
  const handleRename = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const handleRenameSubmit = (id: string, type: 'file' | 'folder') => {
    if (editingName.trim()) {
      setFileList(prevFiles => {
        const updateFileName = (items: FileContent[]): FileContent[] => {
          return items.map(item => {
            if (item.id === id) {
              return { ...item, name: editingName.trim() };
            }
            if (item.children) {
              return { ...item, children: updateFileName(item.children) };
            }
            return item;
          });
        };
        return updateFileName(prevFiles);
      });

      if (currentFileId === id) {
        onFileSelect(id, fileContentsMap[id] || '', editingName.trim());
      }
    }
    setEditingId(null);
    setEditingName('');
  };

  const handleRenameCancel = () => {
    setEditingId(null);
    setEditingName('');
  };

  // =============================================
  // Drag and Drop Handlers
  // =============================================
  
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.stopPropagation();
    setDraggedItem(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedItem !== id) {
      setDropTarget(id);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedItem || draggedItem === targetId) return;

    setFileList(prevFiles => {
      let draggedItemData: FileContent | null = null;
      
      const removeItem = (items: FileContent[]): FileContent[] => {
        return items.filter(item => {
          if (item.id === draggedItem) {
            draggedItemData = { ...item };
            return false;
          }
          if (item.children) {
            item.children = removeItem(item.children);
          }
          return true;
        });
      };

      const newFiles = removeItem([...prevFiles]);

      const addToFolder = (items: FileContent[]): FileContent[] => {
        return items.map(item => {
          if (item.id === targetId && draggedItemData) {
            return {
              ...item,
              children: [...(item.children || []), { ...draggedItemData, parentId: targetId }]
            };
          }
          if (item.children) {
            return {
              ...item,
              children: addToFolder(item.children)
            };
          }
          return item;
        });
      };

      return addToFolder(newFiles);
    });

    setDraggedItem(null);
    setDropTarget(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDropTarget(null);
  };

  // =============================================
  // File Interaction Handlers
  // =============================================
  
  const handleFileClick = (file: FileContent) => {
    if (file.type === 'file') {
      // Get the content from our local state
      const fileContent = fileContentsMap[file.id] || file.content || '';
      
      // Notify parent component without causing a double update
      if (onFileSelect && typeof onFileSelect === 'function') {
        onFileSelect(file.id, fileContent, file.name);
      }
    }
  };

  const toggleFolder = (folderId: string) => {
    setOpenFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
    
    // Force update tree component immediately
    setFileList(prev => [...prev]);
  };

  // =============================================
  // Rendering Functions
  // =============================================
  
  const renderFileTree = (files: FileContent[], level: number = 0) => {
    return files.map(file => {
      if (file.type === 'folder') {
        const isExpanded = openFolders.has(file.id);
        return (
          <div 
            key={file.id}
            onDragOver={(e) => handleDragOver(e, file.id)}
            onDrop={(e) => handleDrop(e, file.id)}
            className={dropTarget === file.id ? styles.dropTarget : ''}
          >
            <div className={styles.fileItem}>
              {editingId === file.id ? (
                <div className={styles.renameControls}>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenameSubmit(file.id, 'folder');
                      if (e.key === 'Escape') handleRenameCancel();
                    }}
                  />
                  <div className={styles.fileActions}>
                    <button 
                      onClick={() => handleRenameSubmit(file.id, 'folder')}
                      className={styles.actionButton}
                      title="Save"
                    >
                      <FiCheck size={14} />
                    </button>
                    <button 
                      onClick={handleRenameCancel}
                      className={styles.actionButton}
                      title="Cancel"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div 
                    className={styles.fileItemName}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFolder(file.id);
                    }}
                  >
                    <Folder 
                      element={file.name}
                      value={file.id}
                      isSelect={selectedFolderId === file.id}
                      expandedItems={openFolders.has(file.id) ? [file.id] : []}
                    />
                  </div>
                  
                  <div className={styles.fileActions}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRename(file.id, file.name);
                      }}
                      className={styles.actionButton}
                      title="Rename"
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file.id, 'folder');
                      }}
                      className={styles.actionButton}
                      title="Delete"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
            {openFolders.has(file.id) && file.children && (
              <div style={{ marginLeft: '1rem' }}>
                {renderFileTree(file.children, level + 1)}
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div 
            key={file.id}
            draggable={editingId !== file.id}
            onDragStart={(e) => handleDragStart(e, file.id)}
            onDragEnd={handleDragEnd}
            className={styles.fileItem}
          >
            {editingId === file.id ? (
              <div className={styles.renameControls}>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRenameSubmit(file.id, 'file');
                    if (e.key === 'Escape') handleRenameCancel();
                  }}
                />
                <div className={styles.fileActions}>
                  <button 
                    onClick={() => handleRenameSubmit(file.id, 'file')}
                    className={styles.actionButton}
                    title="Save"
                  >
                    <FiCheck size={14} />
                  </button>
                  <button 
                    onClick={handleRenameCancel}
                    className={styles.actionButton}
                    title="Cancel"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.fileItemName} onClick={() => handleFileClick(file)}>
                  <File 
                    value={file.id}
                    isSelect={currentFileId === file.id}
                  >
                    {file.name}
                  </File>
                </div>
                
                <div className={styles.fileActions}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRename(file.id, file.name);
                    }}
                    className={styles.actionButton}
                    title="Rename"
                  >
                    <FiEdit2 size={14} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(file.id, 'file');
                    }}
                    className={styles.actionButton}
                    title="Delete"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        );
      }
    });
  };

  // =============================================
  // Render Component
  // =============================================
  
  return (
    <div className={styles.fileTreeContainer}>
      {/*File Tree Actions*/}
      {!isPreview && (
        <div className={styles.fileTreeHeader}>
          <div className={styles.fileTreeActions}>
            <button 
              onClick={() => {
                setSelectedFolderId(null);
                setIsCreatingFile(true);
              }} 
              title="New"
              className={styles.actionButton}
            >
              <FiPlus />
            </button>
          </div>
        </div>
      )}

      {/*File Creation Form*/}
      {isCreatingFile && !isPreview && (
        <div className={styles.createFileForm}>
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="Enter name..."
            autoFocus
          />
          <button onClick={() => handleCreateFile(selectedFolderId)}>Create File</button>
          <button onClick={() => handleCreateFolder(selectedFolderId)}>Create Folder</button>
          <button onClick={() => setIsCreatingFile(false)}>Cancel</button>
        </div>
      )}
    
      {/*File Tree Structure*/}
      <Tree
        className="w-full"
        initialSelectedId={currentFileId || undefined}
        elements={fileList}
        initialExpandedItems={Array.from(openFolders)}
      >
        {fileList.length > 0 ? (
          renderFileTree(fileList)
        ) : (
          <div className={styles.emptyState}>
            <p>No files or folders yet</p>
            {!isPreview && <p>Click + to create one</p>}
          </div>
        )}
      </Tree>
    </div>
  );
}

