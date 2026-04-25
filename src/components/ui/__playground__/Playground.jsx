// Dev-only smoke harness for the brutalist primitive set.
//
// Mount via `?playground=1` from src/index.js. Renders every primitive
// in src/components/ui/* at least once with realistic props so a human
// can eyeball the system end-to-end before wiring consumers.

import React, { useRef, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Drawer,
  Fade,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Icon,
  Input,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Snackbar,
  SnackbarContent,
  SvgIcon,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
} from '../index.js';
// TextField is not (yet) re-exported from the barrel; import direct.
import TextField from '../TextField.jsx';
import { COLORS, SPACING, TYPOGRAPHY } from '../../../design/tokens.js';

const sectionStyle = {
  padding: SPACING.lg,
  borderTop: `2px solid ${COLORS.fg}`,
};

const sectionTitleStyle = {
  fontFamily: TYPOGRAPHY.ui,
  fontSize: TYPOGRAPHY.sizes.h3,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  margin: 0,
  marginBottom: SPACING.md,
};

const rowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: SPACING.md,
  alignItems: 'flex-start',
  marginBottom: SPACING.md,
};

const labelStyle = {
  fontFamily: TYPOGRAPHY.mono,
  fontSize: TYPOGRAPHY.sizes.caption,
  textTransform: 'uppercase',
  color: COLORS.muted,
  marginBottom: SPACING.xs,
  display: 'block',
};

function Section({ title, children }) {
  return (
    <section style={sectionStyle}>
      <h2 style={sectionTitleStyle}>{title}</h2>
      {children}
    </section>
  );
}

function Bench({ label, children }) {
  return (
    <div style={{ minWidth: 240 }}>
      <span style={labelStyle}>{label}</span>
      <div>{children}</div>
    </div>
  );
}

function ButtonsBench() {
  return (
    <div style={rowStyle}>
      <Bench label="default">
        <Button onClick={() => {}}>Click me</Button>
      </Bench>
      <Bench label="disabled">
        <Button disabled>Disabled</Button>
      </Bench>
      <Bench label="with icon">
        <Button>
          <SvgIcon>
            <path d="M5 12h14M12 5v14" stroke="currentColor" strokeWidth="2" fill="none" />
          </SvgIcon>
          Add
        </Button>
      </Bench>
      <Bench label="submit">
        <Button type="submit">Submit</Button>
      </Bench>
    </div>
  );
}

function TypographyBench() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
      <Typography variant="h1">Heading 1 — brutalist display</Typography>
      <Typography variant="h2">Heading 2</Typography>
      <Typography variant="h3">Heading 3</Typography>
      <Typography variant="h4">Heading 4</Typography>
      <Typography variant="body1">
        Body 1 — paragraph copy that wraps across lines without dramatic
        flourish. The system prefers utility over ornament.
      </Typography>
      <Typography variant="body2" color={COLORS.muted}>
        Body 2 muted — secondary copy.
      </Typography>
      <Typography variant="caption">Caption — small annotation</Typography>
      <Typography variant="body1" gutterBottom>
        Body 1 with gutterBottom for spacing rhythm.
      </Typography>
      <Typography variant="body1" noWrap>
        noWrap — this line should clip with ellipsis when narrower than its content lorem ipsum dolor sit amet
      </Typography>
      <Typography variant="body1" align="right">
        Right-aligned body
      </Typography>
    </div>
  );
}

function CardsBench() {
  return (
    <div style={rowStyle}>
      <Bench label="card + content">
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Card title
            </Typography>
            <Typography variant="body2">
              Cards establish a brutalist content container with a thick
              border and no shadow.
            </Typography>
          </CardContent>
        </Card>
      </Bench>
      <Bench label="raised">
        <Card raised>
          <CardContent>
            <Typography variant="body2">Raised variant</Typography>
          </CardContent>
        </Card>
      </Bench>
    </div>
  );
}

function AppBarBench() {
  return (
    <div style={{ marginBottom: SPACING.md }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4">gviz</Typography>
          <div style={{ flex: 1 }} />
          <Button>Action</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

function DividerBench() {
  return (
    <div style={rowStyle}>
      <Bench label="horizontal">
        <div style={{ width: 240 }}>
          <Typography variant="body2">Above</Typography>
          <Divider />
          <Typography variant="body2">Below</Typography>
        </div>
      </Bench>
      <Bench label="vertical">
        <div style={{ display: 'flex', alignItems: 'center', height: 60, gap: SPACING.md }}>
          <Typography variant="body2">Left</Typography>
          <Divider orientation="vertical" />
          <Typography variant="body2">Right</Typography>
        </div>
      </Bench>
    </div>
  );
}

function CheckboxesBench() {
  const [checked, setChecked] = useState(true);
  return (
    <div style={rowStyle}>
      <Bench label="checked">
        <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} />
      </Bench>
      <Bench label="unchecked">
        <Checkbox checked={false} onChange={() => {}} />
      </Bench>
      <Bench label="disabled">
        <Checkbox checked disabled onChange={() => {}} />
      </Bench>
      <Bench label="with label">
        <FormControlLabel
          control={<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} />}
          label="Accept terms"
        />
      </Bench>
    </div>
  );
}

function SwitchesBench() {
  const [on, setOn] = useState(true);
  return (
    <div style={rowStyle}>
      <Bench label="on">
        <Switch checked={on} onChange={(e) => setOn(e.target.checked)} />
      </Bench>
      <Bench label="off">
        <Switch checked={false} onChange={() => {}} />
      </Bench>
      <Bench label="disabled">
        <Switch checked disabled onChange={() => {}} />
      </Bench>
      <Bench label="with label">
        <FormControlLabel
          control={<Switch checked={on} onChange={(e) => setOn(e.target.checked)} />}
          label="Enable feature"
        />
      </Bench>
    </div>
  );
}

function RadioBench() {
  const [value, setValue] = useState('a');
  return (
    <FormControl>
      <FormLabel>Pick one</FormLabel>
      <RadioGroup value={value} onChange={(e) => setValue(e.target.value)} name="demo">
        <FormControlLabel value="a" control={<Radio checked={value === 'a'} />} label="Option A" />
        <FormControlLabel value="b" control={<Radio checked={value === 'b'} />} label="Option B" />
        <FormControlLabel
          value="c"
          control={<Radio checked={value === 'c'} disabled />}
          label="Option C (disabled)"
          disabled
        />
      </RadioGroup>
      <FormHelperText>Helper text in muted</FormHelperText>
    </FormControl>
  );
}

function FormGroupBench() {
  return (
    <FormControl>
      <FormLabel>Toppings</FormLabel>
      <FormGroup row>
        <FormControlLabel control={<Checkbox checked onChange={() => {}} />} label="Cheese" />
        <FormControlLabel control={<Checkbox checked={false} onChange={() => {}} />} label="Onion" />
        <FormControlLabel control={<Checkbox checked onChange={() => {}} />} label="Olives" />
      </FormGroup>
      <FormHelperText error>Required field — error state</FormHelperText>
    </FormControl>
  );
}

function InputBench() {
  const [value, setValue] = useState('hello');
  return (
    <div style={rowStyle}>
      <Bench label="bare Input">
        <FormControl>
          <InputLabel htmlFor="pg-bare">Name</InputLabel>
          <Input id="pg-bare" value={value} onChange={(e) => setValue(e.target.value)} />
        </FormControl>
      </Bench>
      <Bench label="adornments">
        <Input
          value=""
          onChange={() => {}}
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          endAdornment={<InputAdornment position="end">USD</InputAdornment>}
        />
      </Bench>
      <Bench label="multiline">
        <Input
          value="line one\nline two"
          onChange={() => {}}
          multiline
          rows={3}
          fullWidth
        />
      </Bench>
    </div>
  );
}

function TextFieldBench() {
  const [value, setValue] = useState('');
  return (
    <div style={rowStyle}>
      <Bench label="default">
        <TextField label="Email" value={value} onChange={(e) => setValue(e.target.value)} />
      </Bench>
      <Bench label="with helper">
        <TextField label="Username" helperText="3-20 chars" />
      </Bench>
      <Bench label="error">
        <TextField label="Token" value="bad" error helperText="Invalid token" />
      </Bench>
      <Bench label="multiline">
        <TextField label="Notes" multiline rows={3} fullWidth />
      </Bench>
      <Bench label="select">
        <TextField label="Country" select value="us" onChange={() => {}}>
          <MenuItem value="us">United States</MenuItem>
          <MenuItem value="ca">Canada</MenuItem>
          <MenuItem value="mx">Mexico</MenuItem>
        </TextField>
      </Bench>
      <Bench label="password">
        <TextField label="Password" type="password" />
      </Bench>
    </div>
  );
}

function SelectBench() {
  const [value, setValue] = useState('apple');
  return (
    <FormControl>
      <InputLabel id="pg-fruit-label">Fruit</InputLabel>
      <Select
        id="pg-fruit"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      >
        <MenuItem value="apple">Apple</MenuItem>
        <MenuItem value="banana">Banana</MenuItem>
        <MenuItem value="cherry">Cherry</MenuItem>
        <MenuItem value="durian" disabled>
          Durian (disabled)
        </MenuItem>
      </Select>
    </FormControl>
  );
}

function MenuBench() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  return (
    <div>
      {/* Button is not forwardRef-aware; attach the ref to a wrapping span */}
      <span ref={anchorRef} style={{ display: 'inline-block' }}>
        <Button onClick={() => setOpen((o) => !o)}>Open menu</Button>
      </span>
      <Menu anchorEl={anchorRef.current} open={open} onClose={() => setOpen(false)}>
        <MenuItem onClick={() => setOpen(false)}>New file</MenuItem>
        <MenuItem onClick={() => setOpen(false)}>Open…</MenuItem>
        <MenuItem disabled>Save (disabled)</MenuItem>
      </Menu>
    </div>
  );
}

function DialogBlocksBench() {
  // Dialog primitives are rendered inline (no actual modal overlay) just
  // to verify their typography and spacing. Production usage composes
  // them inside a Drawer or Base UI dialog.
  return (
    <Card>
      <CardContent>
        <DialogTitle>Dialog title</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Dialog content text — body copy inside an overlay shell.
          </DialogContentText>
          <DialogContentText variant="body2">
            Variant body2 line for secondary information.
          </DialogContentText>
        </DialogContent>
      </CardContent>
    </Card>
  );
}

function DrawerBench() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>
      <Drawer open={open} onClose={() => setOpen(false)} anchor="right">
        <div style={{ padding: SPACING.lg, minWidth: 280 }}>
          <Typography variant="h3" gutterBottom>
            Drawer
          </Typography>
          <Typography variant="body2">
            Slides from the right. Click outside or press Esc to close.
          </Typography>
          <div style={{ marginTop: SPACING.md }}>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

function SnackbarBench() {
  const [open, setOpen] = useState(false);
  return (
    <div style={rowStyle}>
      <Bench label="trigger">
        <Button onClick={() => setOpen(true)}>Show snackbar</Button>
      </Bench>
      <Bench label="inline content">
        <SnackbarContent message="Saved." action={<Button onClick={() => {}}>Undo</Button>} />
      </Bench>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message="Toast: action complete"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        action={<Button onClick={() => setOpen(false)}>Dismiss</Button>}
      />
    </div>
  );
}

function FadeBench() {
  const [shown, setShown] = useState(true);
  return (
    <div>
      <Button onClick={() => setShown((s) => !s)}>
        {shown ? 'Hide' : 'Show'}
      </Button>
      <div style={{ marginTop: SPACING.sm, height: 60 }}>
        <Fade in={shown}>
          <Card>
            <CardContent>
              <Typography variant="body2">Faded content</Typography>
            </CardContent>
          </Card>
        </Fade>
      </div>
    </div>
  );
}

function AccordionBench() {
  const [expanded, setExpanded] = useState(true);
  return (
    <Accordion expanded={expanded} onChange={(_, next) => setExpanded(next)}>
      <AccordionSummary>Section heading</AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2">
          Disclosure body — expands and collapses with the trigger.
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}

function TableBench() {
  const [order, setOrder] = useState({ key: 'name', dir: 'asc' });
  const data = [
    { name: 'alpha', count: 12 },
    { name: 'beta', count: 7 },
    { name: 'gamma', count: 23 },
  ];
  const sorted = [...data].sort((a, b) => {
    const cmp = a[order.key] > b[order.key] ? 1 : -1;
    return order.dir === 'asc' ? cmp : -cmp;
  });
  const toggle = (key) =>
    setOrder((o) => ({ key, dir: o.key === key && o.dir === 'asc' ? 'desc' : 'asc' }));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.lg }}>
      <Table size="medium">
        <TableHead>
          <TableRow>
            <TableCell scope="col">
              <TableSortLabel
                active={order.key === 'name'}
                direction={order.dir}
                onClick={() => toggle('name')}
              >
                Name
              </TableSortLabel>
            </TableCell>
            <TableCell scope="col" align="right">
              <TableSortLabel
                active={order.key === 'count'}
                direction={order.dir}
                onClick={() => toggle('count')}
              >
                Count
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((row) => (
            <TableRow key={row.name} hover>
              <TableCell>{row.name}</TableCell>
              <TableCell align="right">{row.count}</TableCell>
            </TableRow>
          ))}
          <TableRow selected>
            <TableCell>selected row</TableCell>
            <TableCell align="right">99</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell scope="col">Compact</TableCell>
            <TableCell scope="col" padding="none">No padding</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>row</TableCell>
            <TableCell padding="none">tight</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

function IconBench() {
  return (
    <div style={rowStyle}>
      <Bench label="SvgIcon (default)">
        <SvgIcon>
          <path d="M5 12h14M12 5v14" stroke="currentColor" strokeWidth="2" fill="none" />
        </SvgIcon>
      </Bench>
      <Bench label="SvgIcon large">
        <SvgIcon fontSize="large">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
        </SvgIcon>
      </Bench>
      <Bench label="SvgIcon error">
        <SvgIcon color="error">
          <path d="M12 2L2 22h20L12 2z" stroke="currentColor" strokeWidth="2" fill="none" />
        </SvgIcon>
      </Bench>
      <Bench label="Icon (font glyph)">
        <Icon>★</Icon>
      </Bench>
    </div>
  );
}

function ProgressBench() {
  return (
    <div style={rowStyle}>
      <Bench label="default">
        <CircularProgress />
      </Bench>
      <Bench label="size 48">
        <CircularProgress size={48} />
      </Bench>
      <Bench label="accent">
        <CircularProgress color={COLORS.accent} />
      </Bench>
    </div>
  );
}

const pageStyle = {
  fontFamily: TYPOGRAPHY.ui,
  color: COLORS.fg,
  background: COLORS.bg,
  minHeight: '100vh',
};

const headerStyle = {
  padding: SPACING.lg,
  borderBottom: `2px solid ${COLORS.fg}`,
};

export default function Playground() {
  return (
    <div style={pageStyle}>
      <header style={headerStyle}>
        <Typography variant="h1">Primitive Playground</Typography>
        <Typography variant="body2" color={COLORS.muted}>
          Visual smoke harness for src/components/ui/*. Dev-only. Mounted via ?playground=1.
        </Typography>
      </header>

      <Section title="Atoms">
        <ButtonsBench />
        <IconBench />
        <ProgressBench />
      </Section>

      <Section title="Typography">
        <TypographyBench />
      </Section>

      <Section title="Layout">
        <AppBarBench />
        <CardsBench />
        <DividerBench />
      </Section>

      <Section title="Form — toggles">
        <CheckboxesBench />
        <SwitchesBench />
        <div style={rowStyle}>
          <Bench label="radio group">
            <RadioBench />
          </Bench>
          <Bench label="form group + helper">
            <FormGroupBench />
          </Bench>
        </div>
      </Section>

      <Section title="Form — fields">
        <InputBench />
        <TextFieldBench />
        <div style={rowStyle}>
          <Bench label="select">
            <SelectBench />
          </Bench>
          <Bench label="menu (anchored)">
            <MenuBench />
          </Bench>
        </div>
      </Section>

      <Section title="Disclosure">
        <AccordionBench />
      </Section>

      <Section title="Overlay">
        <div style={rowStyle}>
          <Bench label="dialog blocks">
            <DialogBlocksBench />
          </Bench>
          <Bench label="drawer">
            <DrawerBench />
          </Bench>
          <Bench label="fade">
            <FadeBench />
          </Bench>
        </div>
        <SnackbarBench />
      </Section>
    </div>
  );
}
