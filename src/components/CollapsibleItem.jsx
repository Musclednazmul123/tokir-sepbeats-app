import { Button, Collapsible, Heading, Stack } from "@shopify/polaris";
import { ChevronDownMinor, ChevronUpMinor } from "@shopify/polaris-icons";
import { useCallback, useState } from "react";
import EmbbedVideoModal from "./EmbbedVideoModal";
export default function CollapsibleItem({title, content, expanded, embed_video_modal, modal_title, modal_src}) {
  const [open, setOpen] = useState(expanded || false);
  const handleToggle = useCallback(() => setOpen((open) => !open), []);
  return (
    <div className="Collapsible_Item">
      <Stack vertical>
        <Button
          fullWidth
          monochrome
          plain
          onClick={handleToggle}
          ariaExpanded={open}
          ariaControls="basic-collapsible"
          icon={open?ChevronUpMinor:ChevronDownMinor}
        >
          <Heading>{title}</Heading>
        </Button>
        <Collapsible
          open={open}
          id="basic-collapsible"
          transition={{duration: '125ms', timingFunction: 'ease-in-out'}}
          expandOnPrint
        >
          {
            embed_video_modal && open ? <EmbbedVideoModal
              title={modal_title}
              src={modal_src}
              open={true}
              onCloseCallback={() => {
                setOpen(false);
              }}
            />: null
          }
          <div className="Collapsible_Item__Content">
            {content}
          </div>
        </Collapsible>
      </Stack>
    </div>
  );
}