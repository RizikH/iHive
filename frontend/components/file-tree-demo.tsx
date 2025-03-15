import { File, Folder, Tree } from "@/components/magicui/file-tree"
import { useState, useRef } from 'react';
import { FileContent } from '@/components/magicui/file-tree';
import { FiPlus, FiFolderPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import styles from '@/app/styles/file-tree.module.css';

interface FileTreeDemoProps {
  onFileSelect: (fileId: string, content: string, fileName: string) => void;
  onContentUpdate: (fileId: string, newContent: string) => void;
  currentFileId: string | null;
  onFileDelete: (fileId: string) => void;
}

export default function FileTreeDemo({ onFileSelect, onContentUpdate, currentFileId, onFileDelete }: FileTreeDemoProps) {
  const [files, setFiles] = useState<FileContent[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  const handleCreateFile = (parentId: string | null = null) => {
    const newFile: FileContent = {
      id: Date.now().toString(),
      name: newFileName || 'New File',
      type: 'file',
      content: '',
      parentId: parentId || undefined
    };

    setFiles(prevFiles => {
      if (!parentId) {
        return [...prevFiles, newFile];
      }

      return prevFiles.map(item => updateFileStructure(item, parentId, newFile));
    });

    setNewFileName('');
    setIsCreatingFile(false);
  };

  const handleCreateFolder = (parentId: string | null = null) => {
    const newFolder: FileContent = {
      id: Date.now().toString(),
      name: newFileName || 'New Folder',
      type: 'folder',
      content: '',
      parentId: parentId || undefined,
      children: []
    };

    setFiles(prevFiles => {
      if (!parentId) {
        return [...prevFiles, newFolder];
      }

      return prevFiles.map(item => updateFileStructure(item, parentId, newFolder));
    });

    setNewFileName('');
    setIsCreatingFile(false);
  };

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
    setFiles(prevFiles => {
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
  };

  const handleRename = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const handleRenameSubmit = (id: string, type: 'file' | 'folder') => {
    if (editingName.trim()) {
      setFiles(prevFiles => {
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
    }
    setEditingId(null);
    setEditingName('');
  };

  const handleRenameCancel = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.stopPropagation();
    setDraggedItem(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDropTarget(id);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedItem || draggedItem === targetId) return;

    setFiles(prevFiles => {
      const moveItem = (items: FileContent[], parentId: string | null = null): FileContent[] => {
        let draggedItemData: FileContent | null = null;
        let newItems = items.filter(item => {
          if (item.id === draggedItem) {
            draggedItemData = { ...item, parentId: parentId as string | undefined };
            return false;
          }
          if (item.children) {
            item.children = moveItem(item.children, item.id);
          }
          return true;
        });

        if (targetId === parentId && draggedItemData) {
          return [...newItems, draggedItemData];
        }

        return newItems.map(item => {
          if (item.id === targetId && draggedItemData) {
            return {
              ...item,
              children: [...(item.children || []), draggedItemData]
            };
          }
          return item;
        });
      };

      return moveItem(prevFiles);
    });

    setDraggedItem(null);
    setDropTarget(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDropTarget(null);
  };

  const handleFileClick = (file: FileContent) => {
    if (file.type === 'file') {
      onFileSelect(file.id, file.content || '', file.name);
    }
  };

  const renderFileTree = (files: FileContent[]) => {
    return files.map(file => {
      if (file.type === 'folder') {
        return (
          <div 
            key={file.id} 
            className={styles.treeItem}
          >
            <div className={styles.itemWrapper}>
              <Folder 
                element={file.name}
                value={file.id}
                isSelect={selectedFolderId === file.id}
              />
              <div className={styles.itemActions}>
                <button
                  className={styles.actionButton}
                  onClick={() => handleRename(file.id, file.name)}
                >
                  <FiEdit2 size={14} />
                </button>
                <button
                  className={styles.actionButton}
                  onClick={() => handleDelete(file.id, 'folder')}
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
            {file.children && file.children.length > 0 && (
              <div className={styles.folderContent}>
                {renderFileTree(file.children)}
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div 
            key={file.id} 
            className={styles.treeItem}
            draggable
            onDragStart={(e) => handleDragStart(e, file.id)}
            onDragEnd={handleDragEnd}
          >
            {editingId === file.id ? (
              <div className={styles.renameForm} onClick={e => e.stopPropagation()}>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setEditingName(newValue);
                  }}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === 'Enter') {
                      handleRenameSubmit(file.id, 'file');
                    } else if (e.key === 'Escape') {
                      handleRenameCancel();
                    }
                  }}
                  autoFocus
                  spellCheck={false}
                />
                <div className={styles.renameActions}>
                  <button onClick={() => handleRenameSubmit(file.id, 'file')}>✓</button>
                  <button onClick={handleRenameCancel}>✕</button>
                </div>
              </div>
            ) : (
              <>
                <File 
                  value={file.id}
                  isSelect={currentFileId === file.id}
                  onClick={() => handleFileClick(file)}
                >
                  {file.name}
                </File>
                <div className={styles.itemActions}>
                  <button 
                    className={styles.actionButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRename(file.id, file.name);
                    }}
                    title="Rename"
                  >
                    <FiEdit2 size={14} />
                  </button>
                  <button 
                    className={styles.actionButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(file.id, 'file');
                    }}
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

  return (
    <div className={styles.fileTreeContainer}>
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

      {isCreatingFile && (
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
    
      <Tree
        className="w-full"
        initialSelectedId={currentFileId || undefined}
        elements={files}
      >
        {files.length > 0 ? (
          renderFileTree(files)
        ) : (
          <div className={styles.emptyState}>
            <p>No files or folders yet</p>
            <p>Click + to create one</p>
          </div>
        )}
      </Tree>
    </div>
  );
}

