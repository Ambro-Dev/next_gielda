import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  data: { label: string; value: string }[];
  onChange: (value: string) => void;
  title: string;
};

const SelectBox = (props: Props) => {
  const { data, onChange, title } = props;
  return (
    <Select onValueChange={(e) => onChange(e)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Wybierz..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{title}</SelectLabel>
          {data.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectBox;
