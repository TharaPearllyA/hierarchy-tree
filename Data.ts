export const hierarchy = [{"id":59,"name":"MS2","level":{"id":61,"order":1,"name":"Machine Shop"},"devices":[],"groups":[{"id":68,"name":"Hobbing","level":{"id":67,"order":2,"name":"Operations"},"devices":[{"id":1,"name":"PUMA-AT55","parentId":68,"parentName":"Hobbing"},{"id":2,"name":"MAKINO-PRO3","parentId":68,"parentName":"Hobbing"}],"groups":[],"parentId":59,"parentName":"MS2"},{"id":69,"name":"Turning","level":{"id":67,"order":2,"name":"Operations"},"devices":[{"id":3,"name":"HNK-VTC","parentId":69,"parentName":"Turning"},{"id":4,"name":"HNK-VTL-AT59","parentId":69,"parentName":"Turning"}],"groups":[],"parentId":59,"parentName":"MS2"}],"parentId":71,"parentName":"Coimbatore"},{"id":71,"name":"Coimbatore","level":{"id":60,"order":0,"name":"Location"},"devices":[],"groups":[{"id":59,"name":"MS2","level":{"id":61,"order":1,"name":"Machine Shop"},"devices":[],"groups":[{"id":68,"name":"Hobbing","level":{"id":67,"order":2,"name":"Operations"},"devices":[{"id":1,"name":"PUMA-AT55","parentId":68,"parentName":"Hobbing"},{"id":2,"name":"MAKINO-PRO3","parentId":68,"parentName":"Hobbing"}],"groups":[],"parentId":59,"parentName":"MS2"},{"id":69,"name":"Turning","level":{"id":67,"order":2,"name":"Operations"},"devices":[{"id":3,"name":"HNK-VTC","parentId":69,"parentName":"Turning"},{"id":4,"name":"HNK-VTL-AT59","parentId":69,"parentName":"Turning"}],"groups":[],"parentId":59,"parentName":"MS2"}],"parentId":71,"parentName":"Coimbatore"}],"parentId":null,"parentName":null},{"id":68,"name":"Hobbing","level":{"id":67,"order":2,"name":"Operations"},"devices":[{"id":1,"name":"PUMA-AT55","parentId":68,"parentName":"Hobbing"},{"id":2,"name":"MAKINO-PRO3","parentId":68,"parentName":"Hobbing"}],"groups":[],"parentId":59,"parentName":"MS2"},{"id":69,"name":"Turning","level":{"id":67,"order":2,"name":"Operations"},"devices":[{"id":3,"name":"HNK-VTC","parentId":69,"parentName":"Turning"},{"id":4,"name":"HNK-VTL-AT59","parentId":69,"parentName":"Turning"}],"groups":[],"parentId":59,"parentName":"MS2"},{"id":73,"name":"Lommel","level":{"id":60,"order":0,"name":"Location"},"devices":[{"id":72,"name":"TestDevice","parentId":73,"parentName":"Lommel"}],"groups":[{"id":76,"name":"MS3","level":{"id":61,"order":1,"name":"Machine Shop"},"devices":[{"id":77,"name":"Device4","parentId":76,"parentName":"MS3"}],"groups":[],"parentId":73,"parentName":"Lommel"},{"id":74,"name":"Grinding","level":{"id":67,"order":2,"name":"Operations"},"devices":[{"id":75,"name":"Device2","parentId":74,"parentName":"Grinding"}],"groups":[],"parentId":73,"parentName":"Lommel"},{"id":78,"name":"Shaping","level":{"id":67,"order":2,"name":"Operations"},"devices":[{"id":79,"name":"Device 5","parentId":78,"parentName":"Shaping"}],"groups":[],"parentId":73,"parentName":"Lommel"}],"parentId":null,"parentName":null},{"id":76,"name":"MS3","level":{"id":61,"order":1,"name":"Machine Shop"},"devices":[{"id":77,"name":"Device4","parentId":76,"parentName":"MS3"}],"groups":[],"parentId":73,"parentName":"Lommel"},{"id":74,"name":"Grinding","level":{"id":67,"order":2,"name":"Operations"},"devices":[{"id":75,"name":"Device2","parentId":74,"parentName":"Grinding"}],"groups":[],"parentId":73,"parentName":"Lommel"},{"id":78,"name":"Shaping","level":{"id":67,"order":2,"name":"Operations"},"devices":[{"id":79,"name":"Device 5","parentId":78,"parentName":"Shaping"}],"groups":[],"parentId":73,"parentName":"Lommel"}];

export const levelsData = [{"id":60,"order":0,"name":"Location"},{"id":61,"order":1,"name":"Machine Shop"},{"id":67,"order":2,"name":"Operations"}];

export interface ILevel {
	id: number;
	order?: number;
	name: string;
}

export interface IDevice {
	id?: number;
	name: string;
	parentId?: number;
	parentName?: string;
}

export interface IGroup {
	id?: number;
	name: string;
	devices?: IDevice[];
	groups?: IGroup[];
	parentId?: number;
	parentName?: string;
	level?: ILevel;
}