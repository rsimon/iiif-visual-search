import { useCallback, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick02Icon } from '@hugeicons/core-free-icons';
import { Cozy, type CozyManifest } from 'cozy-iiif';
import { useVisualSearchIndex } from '@/hooks/use-visual-search-index';
import { Button } from '@/lib/shadcn/button';

const IIIF_URL = 'https://raw.githubusercontent.com/cogappLabs/storiiiesViewer/main/docs/demo/grande-jatte.json';

type Error = 'IIIF_ERROR';

export const BuildIndex = () => {

  const [manifest, setManifest] = useState<CozyManifest>();

  const index = useVisualSearchIndex();
  
  const [error, setError] = useState<Error>();

  const onFetchIIIF = useCallback(() => {
    Cozy.parseURL(IIIF_URL).then(result => {
      if (result.type !== 'manifest') {
        setError('IIIF_ERROR');
      } else {
        setManifest(result.resource);
      }
    });
  }, []);

  const onBuildIndex = useCallback(() => {
    if (!index || !manifest) return;

    manifest.canvases.reduce((p, canvas) => p.then(() => {
      console.log(`Indexing ${canvas.id}`);

      const imageUrl = canvas.getImageURL(1024);
      console.log(`Fetching ${imageUrl}`);
      
      return fetch(imageUrl)
        .then(res => res.blob())
        .then(blob => {
          const filename = new URL(imageUrl).pathname.split('/').pop() ?? 'image.bin';
          const file = new File([blob], filename, { type: blob.type });
          return index.addToIndex(file, filename);
        })
    }), Promise.resolve()).then(() => {
      console.log('Done - saving');
      index.save();
    })
  }, [manifest, index]);

  return (
    <div>
      <h1>Build Index</h1>

      <div className="flex gap-1 items-center">
        <Button
          disabled={Boolean(manifest)}
          onClick={onFetchIIIF}>
          Fetch IIIF
        </Button>

        {manifest ? (
          <HugeiconsIcon icon={Tick02Icon} />
        ) : null}
      </div>

      {manifest ? (
        <div>
          <p>
            {manifest.canvases.length} Canvases
          </p>

          <Button
            onClick={onBuildIndex}>
            Build Index
          </Button>
        </div>
      ) : null}
    </div>
  )

}