import { useDirectoryHandle } from '@/hooks/use-directory-handle';
import { Button } from '@/lib/shadcn/button';

export const OpenDirectory = () => {

  const { pickDirectory  } = useDirectoryHandle();

  return (
    <div>
      <Button 
        size="lg"
        onClick={pickDirectory}>
        Open Folder
      </Button>
    </div>
  )

}