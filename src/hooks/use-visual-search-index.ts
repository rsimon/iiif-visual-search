import { useEffect, useState } from 'react';
import { useDirectoryHandle } from './use-directory-handle';
import { openIndex, type VisualSearchIndex } from 'browser-visual-search';

const SEGMENTER_URL = '/models/fastsam-s.onnx';
const EMBEDDER_URL = '/models/clip-vit-b32-visual.onnx';

export const useVisualSearchIndex = () => {
  const { handle } = useDirectoryHandle();

  const [index, setIndex] = useState<VisualSearchIndex>();

  useEffect(() => {
    if (!handle) return;

    openIndex(handle, { 
      segmenterUrl: SEGMENTER_URL, 
      embedderUrl: EMBEDDER_URL,
      create: true 
    }).then(setIndex);
  }, [handle]);

  return index;

}